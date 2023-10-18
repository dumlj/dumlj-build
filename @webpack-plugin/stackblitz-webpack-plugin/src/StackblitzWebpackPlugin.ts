import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import { yarnWorkspaces, type ProjectInWorkspaces } from '@dumlj/shell-lib'
import fs from 'fs-extra'
import path from 'path'
import { glob } from 'glob'
import JSZip from 'jszip'
import type { Compiler } from 'webpack'

export interface Project extends ProjectInWorkspaces {
  name: string
  dependencies?: Project[]
}

export interface StackblitzWebpackPluginOptions extends SeedWebpackPluginOptions {
  manifest?: string
  ignored?: string[]
  files?: string[]
}

export class StackblitzWebpackPlugin extends SeedWebpackPlugin {
  static PLUGIN_NAME = 'stackblitz-webpack-plugin'

  protected manifest: string
  protected ignored: string[]
  protected files: string[]

  constructor(options?: StackblitzWebpackPluginOptions) {
    super(options)

    this.manifest = options?.manifest || 'stackblitz-assets.json'
    this.ignored = [].concat(options?.ignored || [], [
      '**/node_modules/**',
      '**/__tests__/**',
      '**/__typetests__/**',
      '**/jest.*',
      '**/src/**',
      '**/*.map',
      '**/tsconfig.*',
      '**/.npmignore',
      '**/.DS_Store',
    ])

    this.files = [].concat(options?.files || [], ['package.json', 'tsconfig.json'])
  }

  public applyTarball(compiler: Compiler) {
    const { context, webpack } = compiler

    compiler.hooks.thisCompilation.tap(this.pluginName, (compilation) => {
      const { modifiedFiles } = compiler
      const changedFiles = modifiedFiles ? Array.from(modifiedFiles.values()) : []
      const FileCache = compilation.getCache(this.pluginName)

      const travel =
        <A extends any[]>(workspaces: Project[], callback: (project: Project, ...args: A) => void) =>
        (projects: string[], ...args: A) => {
          const travelProject = (projects: string[], collection = new Set<Project>()) => {
            for (const name of projects) {
              for (const workspace of workspaces) {
                if (workspace.name !== name) {
                  continue
                }

                if (collection.has(workspace)) {
                  continue
                }

                collection.add(workspace)
                callback(workspace, ...args)

                const { workspaceDependencies } = workspace
                if (!(Array.isArray(workspaceDependencies) && workspaceDependencies.length > 0)) {
                  continue
                }

                travelProject(workspaceDependencies, collection)
              }
            }

            return collection
          }

          return travelProject(projects)
        }

      const collectExamples = async () => {
        const workspaces = await yarnWorkspaces.options({ cwd: context }).exec()
        const examples: Record<string, string[]> = {}
        const projects: Project[] = []

        const collect = travel<[string]>(workspaces, (project, name) => {
          examples[name].push(project.name)
          projects.push(project)
        })

        for (const workspace of workspaces) {
          const { name, location, workspaceDependencies } = workspace
          if (path.basename(location) !== '__example__') {
            continue
          }

          projects.push(workspace)
          examples[name] = []
          collect(workspaceDependencies, name)
        }

        return { examples, projects }
      }

      const readFile = async (file: string) => {
        if (changedFiles.includes(file)) {
          return FileCache.getPromise<Buffer>(file, null)
        }

        const buffer = await fs.readFile(file)
        await FileCache.storePromise<Buffer>(file, null, buffer)
        return buffer
      }

      type TarballStats = Map<string, { name: string; files: string[]; zip: JSZip }>
      type EntriesMap<T> = T extends Map<infer K, infer V> ? [K, V] : never
      const compileTarballs = async (projects: Project[], examples: Record<string, string[]>) => {
        const files = await glob(
          projects.map((project) => path.join(project.location, '**/*')),
          {
            cwd: context,
            dot: true,
            nodir: true,
            ignore: [...this.ignored],
            windowsPathsNoEscape: true,
          }
        )

        const stats = await Promise.all(
          projects.flatMap(async ({ name, location }) => {
            const file = `${name}.zip`
            const zip = new JSZip()
            const isExample = !!examples[name]

            const matches: string[] = []
            await Promise.all(
              files.map(async (file) => {
                if (!(0 === file.indexOf(location) && file.substring(0, location.length + 1) === `${location}/`)) {
                  return
                }

                const absPath = path.join(context, file)
                const source = await readFile(file)

                zip.file(file, source, { createFolders: false })
                isExample && compilation.fileDependencies.add(absPath)
                matches.push(absPath)
              })
            )

            const buffer = await zip.generateAsync({ type: 'nodebuffer' })
            const source = new webpack.sources.RawSource(buffer)
            compilation.emitAsset(file, source)

            const stats: EntriesMap<TarballStats> = [file, { name, files: matches, zip }]
            return stats
          })
        )

        return new Map(stats)
      }

      const collectExtras = async () =>
        Promise.all(
          this.files.map(async (file) => {
            const absPath = path.join(context, file)
            const buffer = await readFile(absPath)
            const content = buffer.toString('utf-8')
            return [file, content]
          })
        )

      compilation.hooks.optimizeAssets.tapPromise(
        {
          name: this.pluginName,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        async () => {
          const { examples, projects } = await collectExamples()
          const stats = await compileTarballs(projects, examples)
          const extras = await collectExtras()
          const tarballs = Array.from(stats.keys())
          const content = JSON.stringify({ examples, tarballs, extras }, null, 2)
          const source = new webpack.sources.RawSource(content)
          compilation.emitAsset(this.manifest, source)
        }
      )
    })
  }

  public applyScript(compiler: Compiler) {
    const { context, webpack } = compiler
    const plugins = [
      new webpack.DefinePlugin({ __STACKBLITZ_MANIFEST__: JSON.stringify(this.manifest) }),
      new webpack.EntryPlugin(context, path.join(__dirname, 'client'), {
        filename: 'main.stackblitz.js',
      }),
    ]

    plugins.forEach((instance) => instance.apply(compiler))
  }

  public apply(compiler: Compiler) {
    super.apply(compiler)
    this.applyScript(compiler)
    this.applyTarball(compiler)
  }
}

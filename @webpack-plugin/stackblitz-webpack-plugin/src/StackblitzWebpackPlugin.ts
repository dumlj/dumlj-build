import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import { yarnWorkspaces, type ProjectInWorkspaces } from '@dumlj/shell-lib'
import fs from 'fs-extra'
import path from 'path'
import { glob } from 'glob'
import JSZip from 'jszip'
import { IGNORED_PATTERNS } from './constants'
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

    this.manifest = options?.manifest || '/stackblitz-assets.json'
    this.files = [].concat(options?.files || [], ['package.json', 'tsconfig.json'])
    this.ignored = Array.from(new Set([].concat(options?.ignored || [], IGNORED_PATTERNS)))
  }

  public applyTarball(compiler: Compiler) {
    const { context, webpack } = compiler

    compiler.hooks.thisCompilation.tap(this.pluginName, (compilation) => {
      const { modifiedFiles } = compiler
      const changedFiles = modifiedFiles ? Array.from(modifiedFiles.values()) : []
      const FileCache = compilation.getCache(this.pluginName)

      const travel = <A extends any[]>(workspaces: Project[], callback: (project: Project, ...args: A) => void) => {
        return (projects: string[], ...args: A) => {
          const travelProject = (projects: string[], fileCollection = new Set<Project>()) => {
            for (const name of projects) {
              for (const workspace of workspaces) {
                if (workspace.name !== name) {
                  continue
                }

                if (fileCollection.has(workspace)) {
                  continue
                }

                fileCollection.add(workspace)
                callback(workspace, ...args)

                const { workspaceDependencies } = workspace
                if (!(Array.isArray(workspaceDependencies) && workspaceDependencies.length > 0)) {
                  continue
                }

                travelProject(workspaceDependencies, fileCollection)
              }
            }

            return fileCollection
          }

          return travelProject(projects)
        }
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

      const compileTarballs = async (projects: Project[], examples: Record<string, string[]>) => {
        const pattern = projects.map(({ location }) => path.join(location, '**/*'))
        const files = await glob(pattern, {
          cwd: context,
          dot: true,
          nodir: true,
          ignore: [...this.ignored],
          windowsPathsNoEscape: true,
        })

        /** find the project where the detection file is located */
        const isFileInProject = (file: string) => {
          /** 权重 */
          interface MaxWeight {
            name: string
            weight: number
          }

          const project = projects.reduce(
            (max: MaxWeight, { name, location }) => {
              if (0 !== file.indexOf(location)) {
                return max
              }

              const prefix = file.substring(0, location.length + 1)
              if (prefix !== `${location}/`) {
                return max
              }

              if (prefix.length > max.weight) {
                return { name, weight: prefix.length }
              }

              return max
            },
            { weight: 0 } as MaxWeight
          )

          return project?.name
        }

        const fileCollection = new Map(projects.map(({ name }) => [name, []]))
        files.forEach((file) => {
          const project = isFileInProject(file)
          fileCollection.get(project).push(file)
        })

        interface Stats {
          name: string
          files: string[]
          zip: JSZip
        }

        const stats = new Map<string, Stats>()
        await Promise.all(
          projects.map(async ({ name }) => {
            const tarball = `${name}.zip`
            if (stats.has(tarball)) {
              return
            }

            /**
             * locked
             * since all operations are asynchronous, they must be locked first.
             * 因为所有操作都是异步的，所以必须先上锁，否则这个 `stats.has(tarball)` 没有任何作用。
             */
            stats.set(tarball, null)

            const isExample = examples[name]
            const zip = new JSZip()
            const files = fileCollection.get(name)

            await Promise.all(
              files.map(async (file) => {
                const source = await readFile(file)
                zip.file(file, source, { createFolders: false })

                if (isExample) {
                  const absPath = path.join(context, file)
                  compilation.fileDependencies.add(absPath)
                }
              })
            )

            const buffer = await zip.generateAsync({ type: 'nodebuffer' })
            const source = new webpack.sources.RawSource(buffer)
            compilation.emitAsset(tarball, source)

            stats.set(tarball, { name, files, zip })
          })
        )

        return stats
      }

      const collectExtras = async () => {
        return Promise.all(
          this.files.map(async (file) => {
            const absPath = path.join(context, file)
            const buffer = await readFile(absPath)
            const content = buffer.toString('utf-8')
            return [file, content]
          })
        )
      }

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
    const finalPublicPath = this.manifest

    const plugins = [
      new webpack.DefinePlugin({ __STACKBLITZ_MANIFEST__: JSON.stringify(finalPublicPath) }),
      new webpack.EntryPlugin(context, path.join(__dirname, 'client'), {
        filename: 'dumlj.stackblitz-webpack-plugin.js',
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

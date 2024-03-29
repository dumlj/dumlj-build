import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import { InjectEntryScriptWebpackPlugin } from '@dumlj/inject-entry-script-webpack-plugin'
import { findWorkspaceProject, findWorkspaceRootPath, type Project } from '@dumlj/util-lib'
import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import JSZip from 'jszip'
import { HTML_TAG, IGNORED_PATTERNS, OVERSIZE_MESSAGE } from './constants'
import type { Compiler } from 'webpack'
import { isOverSize } from './isOverSize'

export interface ExampleInfo {
  rootPath: string
  examples: Record<string, string[]>
  projects: Set<Project>
  isWorkspace: boolean
}

export interface Stats {
  name: string
  files: string[]
  zip: JSZip
}

export interface StackblitzWebpackPluginOptions extends SeedWebpackPluginOptions {
  /** the name of manifest */
  manifest?: string
  /** ignore file pattern */
  ignored?: string[]
  /** extra files */
  files?: string[]
  /** determine if project is a demo (default name matches `*-example`) */
  test?: (name: string, project: Project) => boolean
  /** custom html tag (default <dumlj-stackblitz></dumlj-stackblitz>) */
  customElement?: string
  /** custom element file path */
  customComponent?: string
}

export class StackblitzWebpackPlugin extends SeedWebpackPlugin {
  static PLUGIN_NAME = 'stackblitz-webpack-plugin'

  protected manifest: string
  protected ignored: string[]
  protected files: string[]
  protected test: (name: string, project: Project) => boolean
  protected customElement: string
  protected customComponent: string

  constructor(options?: StackblitzWebpackPluginOptions) {
    super(options)

    this.manifest = options?.manifest || '/stackblitz-assets.json'
    this.files = (options?.files || []).concat(['package.json', 'tsconfig.json'])
    this.ignored = Array.from(new Set((options?.ignored || []).concat(IGNORED_PATTERNS)))
    this.test = typeof options?.test === 'function' ? options?.test : (name) => /-example\//.test(name)
    this.customElement = options?.customElement || HTML_TAG
    this.customComponent = options?.customElement || path.join(__dirname, 'client')
  }

  public apply(compiler: Compiler) {
    super.apply(compiler)

    this.applyClient(compiler)
    this.applyTarball(compiler)
  }

  /** inject client script */
  protected applyClient(compiler: Compiler) {
    const { webpack } = compiler
    const finalPublicPath = this.manifest

    new webpack.DefinePlugin({
      __STACKBLITZ_HTML_TAG__: JSON.stringify(this.customElement),
      __STACKBLITZ_MANIFEST__: JSON.stringify(finalPublicPath),
    }).apply(compiler)

    new InjectEntryScriptWebpackPlugin(this.customComponent).apply(compiler)
  }

  /** collect project and zip tarballs */
  protected applyTarball(compiler: Compiler) {
    const { context, webpack } = compiler

    compiler.hooks.thisCompilation.tap(this.pluginName, (compilation) => {
      const { modifiedFiles } = compiler
      const changedFiles = modifiedFiles ? Array.from(modifiedFiles.values()) : []
      const FileCache = compilation.getCache(this.pluginName)

      /** get cache, if not exists read file content and push to cache */
      const getCacheOrReadFile = async (file: string) => {
        if (changedFiles.includes(file)) {
          return FileCache.getPromise<Buffer>(file, null)
        }

        const buffer = await fs.promises.readFile(file)
        await FileCache.storePromise<Buffer>(file, null, buffer)
        return buffer
      }

      const travel = <A extends any[]>(workspaces: Project[], callback: (project: Project, ...args: A) => void) => {
        return (projects: string[], ...args: A) => {
          const travelProject = (projects: string[], fileCollection = new Set<Project>()) => {
            for (const name of projects) {
              for (const project of workspaces) {
                if (project.name !== name) {
                  continue
                }

                if (fileCollection.has(project)) {
                  continue
                }

                fileCollection.add(project)
                callback(project, ...args)

                const { workspaceDependencies } = project
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

      /** collect stackblitz demo project */
      const collectExamples = async (): Promise<ExampleInfo> => {
        const rootPath = await findWorkspaceRootPath()
        const workspaces: Project[] = await (async () => {
          if (rootPath) {
            return findWorkspaceProject({ cwd: rootPath })
          }

          const source = await fs.promises.readFile(path.join(context, 'package.json'))
          const { name, version, description, dependencies, private: isPrivate = false } = JSON.parse(source.toString('utf-8'))
          const project = { name, version, description, isPrivate, location: context, dependencies, workspaceDependencies: [] }
          return [project]
        })()

        const projects = new Set<Project>()
        const examples: Record<string, string[]> = {}

        const collect = travel<[string]>(workspaces, (project, name) => {
          examples[name].push(project.name)
          projects.add(project)
        })

        for (const project of workspaces) {
          const { name, workspaceDependencies } = project
          if (!this.test(name, project)) {
            continue
          }

          projects.add(project)
          examples[name] = []
          collect(workspaceDependencies, name)
        }

        return { rootPath: rootPath || context, examples, projects, isWorkspace: !!rootPath }
      }

      /** pack files of projects to tarballs */
      const packTarballs = async ({ rootPath, projects, examples }: ExampleInfo) => {
        const stats = new Map<string, Stats | null>()

        await Promise.all(
          Array.from(projects).map(async ({ name, location }) => {
            const isExample = examples[name]
            const cwd = path.join(rootPath, location)
            const files = await glob('**/*', {
              cwd: cwd,
              dot: true,
              nodir: true,
              ignore: [...this.ignored],
              windowsPathsNoEscape: true,
            })

            if (!files.length) {
              return
            }

            const tarball = `${name}.zip`

            /**
             * locked
             * since all operations are asynchronous, they must be locked first.
             * 因为所有操作都是异步的，所以必须先上锁，否则这个 `stats.has(tarball)` 没有任何作用。
             */
            stats.set(tarball, null)

            const zip = new JSZip()
            await Promise.all(
              files.map(async (file) => {
                const absFile = path.join(cwd, file)
                const source = await getCacheOrReadFile(absFile)
                zip.file(file, source, { createFolders: false })
                isExample && compilation.fileDependencies.add(absFile)
              })
            )

            const buffer = await zip.generateAsync({ type: 'nodebuffer' })
            if (isOverSize(buffer.byteLength)) {
              throw new Error(`${tarball} in project ${name} is oversize.\n${OVERSIZE_MESSAGE}`)
            }

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
            const buffer = await getCacheOrReadFile(absPath)
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
          const { rootPath, examples, projects, isWorkspace } = await collectExamples()
          const stats = await packTarballs({ rootPath, examples, projects, isWorkspace })
          const extras = await collectExtras()
          const tarballs = Array.from(stats.keys())
          const content = JSON.stringify({ examples, tarballs, extras, isWorkspace }, null, 2)
          const source = new webpack.sources.RawSource(content)
          compilation.emitAsset(this.manifest, source)
        }
      )
    })
  }
}

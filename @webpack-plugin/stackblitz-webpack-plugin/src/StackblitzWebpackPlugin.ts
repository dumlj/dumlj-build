import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import fs from 'fs-extra'
import path from 'path'
import { glob, type GlobOptions } from 'glob'
import type { Compiler, Compilation } from 'webpack'
import { yarnWorkspaces, type ProjectInWorkspaces } from '@dumlj/shell-lib'

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

  protected async collectProject(compiler: Compiler) {
    const { context } = compiler
    const workspaces = await yarnWorkspaces.options({ cwd: context }).exec()

    const collect = (deps: string[], collection = new Set<Project>()) => {
      for (const name of deps) {
        for (const workspace of workspaces) {
          if (workspace.name !== name) {
            continue
          }

          if (collection.has(workspace)) {
            continue
          }

          collection.add(workspace)

          const { workspaceDependencies } = workspace
          if (!(Array.isArray(workspaceDependencies) && workspaceDependencies.length > 0)) {
            continue
          }

          collect(workspaceDependencies, collection)
        }
      }

      return collection
    }

    const projects: Project[] = []
    for (const workspace of workspaces) {
      const { location, workspaceDependencies } = workspace
      if (path.basename(location) !== '__example__') {
        continue
      }

      const dependencies = new Set<Project>()
      collect(workspaceDependencies, dependencies)
      projects.push({ ...workspace, dependencies: Array.from(dependencies) })
    }

    return projects
  }

  protected async emitProject(compiler: Compiler, compilation: Compilation, projects: Project[], group?: string) {
    const { context, webpack } = compiler
    const filesInProject: Record<string, string[]> = {}
    const assetsMap = new Map<string, Record<string, string[]>>()

    const emitAsset = async (projects: Project[], group?: string) => {
      for (const { name, location, dependencies } of projects) {
        const token = group || name
        const source = assetsMap.has(token) ? assetsMap.get(token) : {}
        if (source[name]) {
          continue
        }

        if (filesInProject[name]) {
          source[name] = filesInProject[name]
        } else {
          const globOptions: GlobOptions = {
            cwd: path.join(context, location),
            dot: true,
            nodir: true,
            ignore: [...this.ignored],
          }

          const files = await glob(['**/*'], globOptions)
          const assets: string[] = []
          for (const filePath of files) {
            const file = filePath.toString()
            const srcFile = path.join(context, location, file)
            const outFile = path.join(location, file)
            const content = await fs.readFile(srcFile)
            const source = new webpack.sources.RawSource(content)

            compilation.fileDependencies.add(srcFile)
            compilation.emitAsset(outFile, source, {
              size: content.byteLength,
              sourceFilename: srcFile,
            })

            assets.push(outFile)
          }

          filesInProject[name] = assets
          source[name] = assets
        }

        assetsMap.set(token, source)

        if (Array.isArray(dependencies) && dependencies.length) {
          await emitAsset(dependencies, name)
        }
      }
    }

    await emitAsset(projects, group)
    return assetsMap
  }

  public apply(compiler: Compiler) {
    super.apply(compiler)

    const { context, webpack } = compiler
    new webpack.DefinePlugin({ __STACKBLITZ_MANIFEST__: JSON.stringify(this.manifest) }).apply(compiler)
    new webpack.EntryPlugin(context, path.join(__dirname, 'client')).apply(compiler)

    compiler.hooks.thisCompilation.tap(this.pluginName, (compilation) => {
      compilation.hooks.optimizeAssets.tapPromise(
        {
          name: this.pluginName,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        async () => {
          const projects = await this.collectProject(compiler)
          const assetsMap = await this.emitProject(compiler, compilation, projects)
          const dataSource = Array.from(assetsMap.entries()).reduce((result, [name, assets]) => {
            result[name] = assets
            return result
          }, {})

          const extraFiles = await Promise.all(
            this.files.map(async (file) => {
              const content = await fs.readFile(path.join(context, file), 'utf-8')
              return [file, content]
            })
          )

          const files = extraFiles.reduce((files, [name, content]) => {
            files[name] = content
            return files
          }, {})

          const content = JSON.stringify({ projects: dataSource, files }, null, 2)
          const source = new webpack.sources.RawSource(content)
          compilation.emitAsset(this.manifest, source)
        }
      )
    })
  }
}

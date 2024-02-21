import path from 'path'
import micromatch from 'micromatch'
import VirtualModulesPlugin from 'webpack-virtual-modules'
import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import { isLoader } from './utils/isLoader'
import { DYNAMIC_FILE_SUFFIX, VIRTUAL_MODULE_RENDER } from './constants'
import type { DynamicClientLoaderOptions } from './dynamicClientLoader'
import { type Compiler } from 'webpack'
import type { VirtualBuilder, Loader, FilenameParts } from './types'

export const LOADER_PATH = require.resolve('./dynamicClientLoader')

export interface NextDynamicClientWebpackPluginOptions extends SeedWebpackPluginOptions {
  /** 目标文件夹 */
  src: string | string[]
  /** 默认值为 .dynamic */
  suffix?: string
  /** 包含文件 */
  include?: string | string[]
  /** 过滤文件 */
  exclude?: string | string[]
  /** 渲染虚拟模块 */
  renderVirtualModule?: VirtualBuilder
  /** loaders */
  loaders?: Loader | Loader[]
}

export class NextDynamicClientWebpackPlugin extends SeedWebpackPlugin {
  static PLUGIN_NAME = 'next-dynamic-client-webpack-plugin'

  protected src: string[]
  protected include: string[]
  protected exclude: string[]
  protected suffix: string
  /** key 为源文件绝对路径 */
  protected virtualModules: Map<string, string>
  protected renderVirtualModule: VirtualBuilder
  protected loaders: Loader[]

  constructor(options?: NextDynamicClientWebpackPluginOptions) {
    super(options)

    const { src, include, exclude, suffix, renderVirtualModule, loaders } = options || {}
    this.src = Array.isArray(src) ? src : typeof src === 'string' ? [src] : []
    this.include = Array.isArray(include) ? include : typeof include === 'string' ? [include] : []
    this.exclude = Array.isArray(exclude) ? exclude : typeof exclude === 'string' ? [exclude] : []
    this.suffix = typeof suffix === 'string' ? suffix : DYNAMIC_FILE_SUFFIX
    this.virtualModules = new Map()
    this.renderVirtualModule = typeof renderVirtualModule === 'function' ? renderVirtualModule : VIRTUAL_MODULE_RENDER
    this.loaders = (loaders ? (Array.isArray(loaders) ? loaders : [loaders]) : []).filter(isLoader)
  }

  public apply(compiler: Compiler) {
    super.apply(compiler)
    this.applyReplacement(compiler)
    this.applyVirtualModules(compiler)
  }

  protected applyReplacement(compiler: Compiler) {
    compiler.options.module.rules.push({
      test: /\.m?(t|j)sx?$/,
      loader: LOADER_PATH,
      options: <DynamicClientLoaderOptions>{
        getVirtualModules: () => this.virtualModules,
      },
    })
  }

  protected applyVirtualModules(compiler: Compiler) {
    const fs = this.utilizeFSByCompiler(compiler)

    const VM = new VirtualModulesPlugin()
    VM.apply(compiler)

    const generateVirtualModule = async (file: string) => {
      /**
       * Filter out files that may cause conflicts, i.e.,
       * files with the same naming format as virtual files.
       */
      if (this.isVirtualFile(file)) {
        return
      }

      /**
       * Modify the contents of the source file,
       * so module replacement cannot be done with plug-ins
       * such as "NormalModuleReplacementPlugin" because of dependencies.
       */
      const virtualFile = this.getVirtualFile(file)
      // Need to use the path of the virtual file
      const parts = this.disassembleFilename(virtualFile)
      const context = { ...parts, file: virtualFile, origin: file }
      const virtualModuleContent = this.renderVirtualModule(context)
      this.virtualModules.set(file, virtualModuleContent)

      // Generate a virtual file with the content of the source file
      const originSource = (await fs.readFile(file))!
      VM.writeModule(virtualFile, originSource.toString('utf-8'))
    }

    const generateVirtualModules = async (folder: string) => {
      const dir = path.join(compiler.context, folder)
      const filenames = (await fs.readdir(dir)) as string[]
      if (!(Array.isArray(filenames) && filenames.length > 0)) {
        return
      }

      const promises = this.filterFiles(filenames).map((filename) => {
        const file = path.join(dir, filename)
        return generateVirtualModule(file)
      })

      await Promise.all(promises)
    }

    compiler.hooks.beforeCompile.tapPromise(this.pluginName, async () => {
      const promises = this.src.map((folder) => generateVirtualModules(folder))
      await Promise.all(promises)
    })
  }

  protected disassembleFilename(file: string) {
    const extname = path.extname(file)
    const filename = path.basename(file)
    const stem = filename.replace(extname, '')
    const folder = path.dirname(file)
    return { folder, stem, extname }
  }

  protected assembleFilename(parts: FilenameParts) {
    const { folder, stem, extname } = parts
    return path.join(folder, `${stem}${this.suffix}${extname}`)
  }

  protected getVirtualFile(file: string) {
    const parts = this.disassembleFilename(file)
    return this.assembleFilename(parts)
  }

  protected isVirtualFile(file: string) {
    if (file.endsWith(this.suffix)) {
      return true
    }

    const { stem } = this.disassembleFilename(file)
    return stem.endsWith(this.suffix)
  }

  protected filterFiles(files: string[]) {
    return Array.from(
      (function* (include, exclude) {
        for (const file of files) {
          if (include.length > 0) {
            if (micromatch.isMatch(file, include)) {
              yield file
            }

            continue
          }

          if (exclude.length > 0) {
            if (!micromatch.isMatch(file, exclude)) {
              yield file
            }

            continue
          }

          yield file
        }
      })(this.include, this.exclude)
    )
  }
}

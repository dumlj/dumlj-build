import { SeedWebpackPlugin } from '@dumlj/seed-webpack-plugin'
import fs from 'fs-extra'
import JSZip from 'jszip'
import path from 'path'
import type { Compiler } from 'webpack'

export interface OneWebpackZipPluginOptions {
  /** output file name */
  output?: string
  /**
   * wrap a folder
   * @example
   * - a.js
   * - b.js
   * set wrap is folder
   * result zip:
   *  - folder
   *    - a.js
   *    - b.js
   */
  wrap?: string
  /** only output zip file */
  lonely?: boolean
  /** extra files */
  extras?: Record<string, string>
}

export class ZipWebpackPlugin extends SeedWebpackPlugin {
  static PLUGIN_NAME = 'zip-webpack-plugin'
  protected output: string
  protected wrap?: string
  protected lonely: boolean
  protected extras?: Record<string, string>

  constructor(options?: OneWebpackZipPluginOptions) {
    super()

    const { output, wrap, lonely, extras } = options || {}
    this.output = typeof output === 'string' && output ? output : 'main.zip'
    this.wrap = typeof wrap === 'string' && wrap ? wrap : undefined
    this.lonely = typeof lonely === 'boolean' ? lonely : false
    this.extras = typeof extras === 'object' ? extras : {}
  }

  public apply(compiler: Compiler) {
    super.apply(compiler)

    const { webpack, options } = compiler
    const { output } = options
    const zip = new JSZip()

    /**
     * 保证文件夹名称
     * 系统压缩出来会自带文件夹
     * 但实际可能并没有文件夹
     */
    if (typeof this.wrap === 'string') {
      zip.folder(this.wrap)
    }

    compiler.hooks.thisCompilation.tap(this.pluginName, (compilation) => {
      if (compilation.compiler.isChild()) {
        return
      }

      compilation.hooks.processAssets.tapPromise(
        {
          name: this.pluginName,
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ANALYSE,
        },
        async () => {
          compilation.getAssets().forEach(({ name, source }) => {
            const target = this.wrap ? path.join(this.wrap, name) : name
            zip.file(target, source.buffer(), {
              createFolders: true,
            })

            // 删掉其他文件输出
            if (this.lonely === true) {
              compilation.deleteAsset(name)
            }
          })

          /** 额外的文件 */
          const extras = Object.keys(this.extras || {})
          // 保证必须为文件而非文件夹
          const isFilesMap = await Promise.all(
            extras.map(async (file) => {
              return (await fs.pathExists(file)) && (await fs.stat(file)).isFile()
            })
          )

          const needCompressFiles = extras.filter((_, index) => isFilesMap[index])
          if (needCompressFiles.length > 0) {
            const assets = compilation.getAssets().map(({ name }) => path.join(output.path, name))
            const finalFiles = needCompressFiles.filter((file) => -1 === assets.indexOf(file))
            await Promise.all(
              finalFiles.map(async (file) => {
                // 产物地址
                const outpath = this.wrap ? path.join(this.wrap, this.extras[file]) : this.extras[file]
                const relativePath = path.relative(output.path, outpath)
                const buffer = await fs.readFile(file)
                zip.file(relativePath, buffer)
              })
            )
          }

          const content = await zip.generateAsync({ type: 'nodebuffer' })
          compilation.emitAsset(this.output, new webpack.sources.RawSource(content, false))
        }
      )
    })
  }
}

import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import { fs, vol } from 'memfs'
import type { Compiler } from 'webpack'

export interface VitrualWebpackPluginOptions extends SeedWebpackPluginOptions {
  /** 读硬盘 */
  readFromDisk?: boolean
  /** 写硬盘 */
  writeToDisk?: boolean
  /** 初始时的文件 */
  files?: Record<string, string>
  /** 清除文件 */
  empty?: boolean
}

export class VitrualWebpackPlugin extends SeedWebpackPlugin {
  static PLUGIN_NAME = 'vitrual-webpack-plugin'

  /** 读硬盘 */
  protected readFromDisk: boolean
  /** 写硬盘 */
  protected writeToDisk: boolean
  /** 文件 */
  protected files: Record<string, string>

  static get files() {
    return vol.toJSON()
  }

  constructor(options?: VitrualWebpackPluginOptions) {
    super(options)

    const { files, readFromDisk = false, writeToDisk = false } = options || {}
    this.readFromDisk = readFromDisk
    this.writeToDisk = writeToDisk
    this.files = {
      ...(options?.empty ? {} : { 'src/index.js': '' }),
      ...files,
    }
  }

  public apply(compiler: Compiler) {
    super.apply(compiler)

    if (this.readFromDisk === false) {
      compiler.inputFileSystem = fs
    }

    if (this.writeToDisk === false) {
      compiler.outputFileSystem = fs
    }

    compiler.hooks.thisCompilation.tap(this.pluginName, () => {
      vol.reset()
      vol.fromJSON(this.files)
    })
  }
}

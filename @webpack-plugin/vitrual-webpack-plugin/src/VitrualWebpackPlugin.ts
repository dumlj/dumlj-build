import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import { fs, vol } from 'memfs'
import type { Compiler } from 'webpack'

export interface VitrualWebpackPluginOptions extends SeedWebpackPluginOptions {
  /** 写硬盘 */
  writeToDisk?: boolean
  /** 初始时的文件 */
  files?: Record<string, string>
}

export class VitrualWebpackPlugin extends SeedWebpackPlugin {
  static PLUGIN_NAME = 'vitrual-webpack-plugin'

  /** 写硬盘 */
  protected writeToDisk: boolean
  /** 文件 */
  protected files: Record<string, string>

  static get files() {
    return vol.toJSON()
  }

  constructor(options?: VitrualWebpackPluginOptions) {
    super(options)

    const { files, writeToDisk = false } = options || {}
    this.writeToDisk = writeToDisk
    this.files = files || {
      'src/index.js': '',
    }
  }

  public apply(compiler: Compiler) {
    super.apply(compiler)

    compiler.inputFileSystem = fs

    if (this.writeToDisk === false) {
      compiler.outputFileSystem = fs
    }

    compiler.hooks.thisCompilation.tap(this.pluginName, () => {
      vol.reset()
      vol.fromJSON(this.files)
    })
  }
}

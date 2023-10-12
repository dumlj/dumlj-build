import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import { fs, vol } from 'memfs'
import type { Compiler } from 'webpack'

export interface VitrualWebpackPluginOptions extends SeedWebpackPluginOptions {
  files: Record<string, string>
}

export class VitrualWebpackPlugin extends SeedWebpackPlugin {
  static PLUGIN_NAME = 'vitrual-webpack-plugin'
  protected files: Record<string, string>

  constructor(options?: VitrualWebpackPluginOptions) {
    super(options)

    const { files } = options || {}
    this.files = files || {
      'src/index.js': '',
    }
  }

  public apply(compiler: Compiler) {
    super.apply(compiler)

    compiler.inputFileSystem = fs
    compiler.outputFileSystem = fs

    compiler.hooks.thisCompilation.tap(this.pluginName, () => {
      vol.reset()
      vol.fromJSON(this.files)
    })
  }
}

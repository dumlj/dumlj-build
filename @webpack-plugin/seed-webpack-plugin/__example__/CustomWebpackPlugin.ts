import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import type { Compiler } from 'webpack'

export interface CustomWebpackPluginOptions extends SeedWebpackPluginOptions {
  unnecessary: string
}

export class CustomWebpackPlugin extends SeedWebpackPlugin {
  static PLUGIN_NAME = 'custom-webpack-plugin'
  protected unnecessary?: string

  constructor(options?: CustomWebpackPluginOptions) {
    super(options)

    const { unnecessary } = options || {}
    this.unnecessary = unnecessary
  }

  public apply(compiler: Compiler) {
    super.apply(compiler)

    if (this.isSkipIncomplete('skip operation when necessary options are missed.', { unnecessary: this.unnecessary })) {
      return
    }

    compiler.hooks.thisCompilation.tap(this.pluginName, () => {
      this.logger.info('todo something...')
    })
  }
}

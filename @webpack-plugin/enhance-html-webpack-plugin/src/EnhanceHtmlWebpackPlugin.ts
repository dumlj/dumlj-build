import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import type { Compiler } from 'webpack'

export interface EnhanceHtmlWebpackPluginOptions extends SeedWebpackPluginOptions {
  /**
   * @todo
   * add some plugin options
   */
}

export class EnhanceHtmlWebpackPlugin extends SeedWebpackPlugin {
  static PLUGIN_NAME = 'enhance-html-webpack-plugin'

  constructor(options?: EnhanceHtmlWebpackPluginOptions) {
    super(options)

    /**
     * please remove these comments
     *
     * @todo
     * add some initialization logic code
     *
     * @example
     * const { debug } = options
     * console.log({ debug })
     */
  }

  public apply(compiler: Compiler) {
    super.apply(compiler)

    /**
     * please remove these comments
     *
     * @todo
     * add some plugin feature logic code
     *
     * @example
     * const { webpack, options } = compiler
     * const { output } = options
     *
     * const Plugin = this.use(SeedWebpackPlugin)
     * new Plugin().apply(compiler)
     *
     * compiler.hooks.emit.tapPromise(this.pluginName, async (compilation) => {
     *  this.notify('info', 'This is an example plugin')
     * })
     */
  }
}

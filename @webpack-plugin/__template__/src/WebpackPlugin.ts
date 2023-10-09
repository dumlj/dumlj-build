import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import type { Compiler } from 'webpack'

export interface WebpackPluginOptions extends SeedWebpackPluginOptions {
  /**
   * @todo
   * add some plugin options
   */
}

export class WebpackPlugin extends SeedWebpackPlugin {
  static PLUGIN_NAME = 'webpack-plugin'

  constructor(options?: WebpackPluginOptions) {
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

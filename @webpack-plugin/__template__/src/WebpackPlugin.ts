import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import type { Compiler } from 'webpack'

export interface WebpackPluginOptions extends SeedWebpackPluginOptions {
  // add some plugin options
}

export class WebpackPlugin extends SeedWebpackPlugin {
  static PLUGIN_NAME = 'webpack-plugin'

  constructor(options?: WebpackPluginOptions) {
    super(options)

    /**
     * todo something...
     * please remove these comments
     *
     * @example
     * const { debug } = options
     * console.log({ debug })
     */
  }

  public apply(compiler: Compiler) {
    super.apply(compiler)

    /**
     * todo something...
     * please remove these comments
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

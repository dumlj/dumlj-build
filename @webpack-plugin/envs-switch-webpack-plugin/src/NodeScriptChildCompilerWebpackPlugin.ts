import { type Compiler, type Compilation } from 'webpack'
import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'

export class NodeScriptChildCompilerWebpackPlugin extends SeedWebpackPlugin {
  protected mainCompilaction: Compilation

  constructor(mainCompilaction: Compilation, options?: SeedWebpackPluginOptions) {
    super(options)
    this.mainCompilaction = mainCompilaction
  }

  public apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap(this.pluginName, () => {
      compiler.hooks.afterCompile.tap(this.pluginName, (compilation) => {
        for (const [name, source] of Object.entries(compilation.assets)) {
          this.mainCompilaction.emitAsset(name, source)
        }
      })
    })
  }
}

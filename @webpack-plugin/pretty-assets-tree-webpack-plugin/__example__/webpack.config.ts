import { MemfsWebpackPlugin } from '@dumlj/memfs-webpack-plugin'
import { PrettyAssetsTreeWebpackPlugin } from '@dumlj/pretty-assets-tree-webpack-plugin'
import chalk from 'chalk'
import type { Configuration, Compiler } from 'webpack'

const CONFIG: Configuration = {
  mode: 'production',
  plugins: [
    new PrettyAssetsTreeWebpackPlugin({
      banner: chalk.whiteBright.bold('The following files are artifacts.'),
    }),
    // output to memory
    new MemfsWebpackPlugin({
      /**
       * @param boolean
       * You can open it and check the build folder
       * after webpack build.
       */
      // writeToDisk: true,
    }),
    // simulate emit assets
    {
      apply(compiler: Compiler) {
        const { webpack } = compiler
        compiler.hooks.thisCompilation.tap('use-for-emit-and-ignore-me', (compilation) => {
          compilation.hooks.processAssets.tapPromise('use-for-emit-and-ignore-me', async () => {
            compilation.emitAsset('constants/conf.js', new webpack.sources.RawSource(''))
            compilation.emitAsset('services/echo.js', new webpack.sources.RawSource(''))
            compilation.emitAsset('services/aaa/echo.js', new webpack.sources.RawSource(''))
            compilation.emitAsset('services/aaa/aaa.js', new webpack.sources.RawSource(''))
            compilation.emitAsset('utils/find.js', new webpack.sources.RawSource(''))
            compilation.emitAsset('utils/each.js', new webpack.sources.RawSource(''))
            compilation.emitAsset('hello.js', new webpack.sources.RawSource(''))
          })
        })
      },
    },
  ],
}

export default CONFIG

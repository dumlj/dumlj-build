import path from 'path'
import { EnvsSwitchWebpackPlugin } from '@dumlj/envs-switch-webpack-plugin'
import { ok } from '@dumlj/feature-pretty'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { type Configuration, type Compiler } from 'webpack'

const CONFIG: Configuration = {
  mode: 'production',
  entry: path.join(__dirname, './index'),
  output: {
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new EnvsSwitchWebpackPlugin(),
    {
      apply(compiler: Compiler) {
        compiler.hooks.afterDone.tap('use-for-echo-and-ignore-me', (stats) => {
          if (stats.hasErrors()) {
            return
          }

          ok(`Run node ./dist/switch-env.js [development, production] to switch env.`, { verbose: false })
        })
      },
    },
  ],
}

export default CONFIG

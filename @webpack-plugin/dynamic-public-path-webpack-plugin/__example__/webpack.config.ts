import { DynamicPublicPathWebpackPlugin } from '@dumlj/dynamic-public-path-webpack-plugin'
import path from 'path'
import { ok } from '@dumlj/feature-pretty'
import { type Compiler, type Configuration } from 'webpack'

const CONFIG: Configuration = {
  mode: 'production',
  entry: path.join(__dirname, 'index'),
  plugins: [
    new DynamicPublicPathWebpackPlugin({
      s3: {
        publicPath: '/',
        envs: {
          'process.env.WS': 's3',
        },
      },
      oss: {
        publicPath: '/',
        envs: {
          'process.env.WS': 'oss',
        },
      },
    }),
    {
      apply(compiler: Compiler) {
        compiler.hooks.afterDone.tap('use-for-echo-and-ignore-me', (stats) => {
          if (stats.hasErrors()) {
            return
          }

          ok(`See s3.html or oss.html and you can try to change public path option.`, { verbose: false })
        })
      },
    },
  ],
}

export default CONFIG

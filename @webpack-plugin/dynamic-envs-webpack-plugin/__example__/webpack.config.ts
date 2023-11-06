import { VitrualWebpackPlugin } from '@dumlj/vitrual-webpack-plugin'
import { DynamicEnvsWebpackPlugin } from '@dumlj/dynamic-envs-webpack-plugin'
import { ok, info } from '@dumlj/feature-pretty'
import path from 'path'
import { type Compiler, type Configuration } from 'webpack'

const CONFIG: Configuration = {
  mode: 'production',
  entry: path.join(__dirname, 'index'),
  output: {
    path: '/',
    clean: true,
  },
  plugins: [
    new VitrualWebpackPlugin({
      empty: true,
      readFromDisk: true,
    }),
    new DynamicEnvsWebpackPlugin({
      'process.env.APP_ENV': JSON.stringify('development'),
    }),
    {
      apply(compiler: Compiler) {
        compiler.hooks.afterDone.tap('use-for-echo-and-ignore-me', (stats) => {
          if (stats.hasErrors()) {
            return
          }

          const files = VitrualWebpackPlugin.files
          ok(`The following is the content of main.js.`, { verbose: false })

          // eslint-disable-next-line no-console
          console.log(`\n${files['/main.js']}\n`)

          info('The first half is used to getting envs and was automatically injected.', { verbose: false })
        })
      },
    },
  ],
}

export default CONFIG

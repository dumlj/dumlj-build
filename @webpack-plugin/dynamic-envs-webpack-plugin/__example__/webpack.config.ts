import { MemfsWebpackPlugin } from '@dumlj/memfs-webpack-plugin'
import { DynamicEnvsWebpackPlugin } from '@dumlj/dynamic-envs-webpack-plugin'
import { ok, info } from '@dumlj/feature-pretty'
import path from 'path'
import { type Compiler, type Configuration } from 'webpack'

const CONFIG: Configuration = {
  mode: 'production',
  entry: path.join(__dirname, 'index'),
  output: {
    /** remove next-line will write disk */
    path: '/',
    clean: true,
  },
  plugins: [
    /** remove next-line will write disk */
    new MemfsWebpackPlugin({
      empty: true,
      readFromDisk: true,
    }),
    new DynamicEnvsWebpackPlugin({
      'process.env.APP_ENV': JSON.stringify('development'),
    }),
    // // batch exceute will inject multiple env getter
    // new DynamicEnvsWebpackPlugin({
    //   'process.env.APP_ENV_ANOTHER_KEY': JSON.stringify('another_development'),
    // }),
    {
      apply(compiler: Compiler) {
        compiler.hooks.afterDone.tap('use-for-echo-and-ignore-me', (stats) => {
          if (stats.hasErrors()) {
            return
          }

          const files = MemfsWebpackPlugin.files
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

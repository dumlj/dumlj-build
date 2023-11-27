import { MemfsWebpackPlugin } from '@dumlj/memfs-webpack-plugin'
import { ok } from '@dumlj/feature-pretty'
import type { Configuration, Compiler } from 'webpack'

const CONFIG: Configuration = {
  mode: 'production',
  output: {
    clean: true,
    /** remove next-line will write disk */
    path: '/',
  },
  plugins: [
    /** remove next-line will write disk */
    new MemfsWebpackPlugin({
      readFromDisk: false,
      writeToDisk: false,
      files: {
        './src/index.js': 'console.log("i am virtual module.")',
      },
    }),
    {
      apply(compiler: Compiler) {
        compiler.hooks.afterDone.tap('use-for-echo-and-ignore-me', (stats) => {
          if (stats.hasErrors()) {
            return
          }

          const files = MemfsWebpackPlugin.files
          ok(`The following is the content of main.js.`, { verbose: false })

          const { '/main.js': main } = files
          // eslint-disable-next-line no-console
          console.log(`\n${main}\n`)
        })
      },
    },
  ],
}

export default CONFIG

import { MemfsWebpackPlugin } from '@dumlj/memfs-webpack-plugin'
import { ZipWebpackPlugin } from '@dumlj/zip-webpack-plugin'
import { mapFilesToOrbitTree, stringifyOrbitTree } from '@dumlj/util-lib'
import { promisify } from 'util'
import chalk from 'chalk'
import JSZip from 'jszip'
import { type Configuration, type Compiler } from 'webpack'

const CONFIG: Configuration = {
  mode: 'development',
  output: {
    /** remove next-line will write disk */
    path: '/',
  },
  plugins: [
    /** remove next-line will write disk */
    new MemfsWebpackPlugin({
      files: {
        '/not_import.js': 'console.log("this is a not imported module")',
      },
      /**
       * @param boolean
       * You can open it and check the build folder
       * after webpack build.
       */
      // writeToDisk: true
    }),
    new ZipWebpackPlugin({
      // default false
      lonely: false,
      extras: {
        '/not_import.js': '/do_import.js',
      },
    }),
    {
      apply(compiler: Compiler) {
        compiler.hooks.afterDone.tap('use-for-echo-and-ignore-me', async (stats) => {
          if (stats.hasErrors()) {
            return
          }

          const main = 'main.zip'
          const buffer = await promisify(compiler.outputFileSystem.readFile)(`/${main}`)
          const jszip = new JSZip()
          const zip = await jszip.loadAsync(buffer!)
          const files = Object.keys(zip.files)
          const tree = mapFilesToOrbitTree(files)
          const messages = [chalk.whiteBright.bold(main), ...stringifyOrbitTree(tree!).map(({ orbit, content }) => [orbit, chalk.greenBright.bold(content)].join(' '))]
          // eslint-disable-next-line no-console
          console.log(`\n${messages.join('\n')}\n`)
        })
      },
    },
  ],
}

export default CONFIG

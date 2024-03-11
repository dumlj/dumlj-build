import { InjectEntryScriptWebpackPlugin } from '@dumlj/inject-entry-script-webpack-plugin'
import { MemfsWebpackPlugin } from '@dumlj/memfs-webpack-plugin'
import { ok, info } from '@dumlj/feature-pretty'
import chalk from 'chalk'
import type { Configuration, Compiler } from 'webpack'

const CONFIG: Configuration = {
  mode: 'production',
  /** remove next-line will write disk */
  context: '/',
  output: {
    clean: true,
    /** remove next-line will write disk */
    path: '/dist',
  },
  plugins: [
    /** remove next-line will write disk */
    new MemfsWebpackPlugin({
      empty: true,
      files: {
        // write content to memory files
        '/src/index.js': 'console.log("nothing.")',
        '/src/need-inject-script.js': 'console.log("I will be injected by InjectEntryScriptWebpackPlugin")',
      },
    }),
    new InjectEntryScriptWebpackPlugin('/src/need-inject-script.js'),
    {
      apply(compiler: Compiler) {
        compiler.hooks.afterDone.tap('use-for-echo-and-ignore-me', (stats) => {
          if (stats.hasErrors()) {
            return
          }

          const files = MemfsWebpackPlugin.files
          ok(`The following is the content of main.js.`, { verbose: false })

          const { '/dist/main.js': main, '/src/need-inject-script.js': inject } = files
          // eslint-disable-next-line no-console
          console.log(`\n${main!.replace(inject!, ($1) => chalk.white.bold($1))}\n`)

          info('The first half is used to getting envs and was automatically injected.', { verbose: false })
        })
      },
    },
  ],
}

export default CONFIG

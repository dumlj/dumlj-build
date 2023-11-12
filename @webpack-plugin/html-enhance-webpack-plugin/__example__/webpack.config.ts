import { HtmlEnhanceWebpackPlugin } from '@dumlj/html-enhance-webpack-plugin'
import { VitrualWebpackPlugin } from '@dumlj/vitrual-webpack-plugin'
import { ok } from '@dumlj/feature-pretty'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import type { Configuration, Compiler } from 'webpack'

const htmlWebpackPluginInstance = new HtmlWebpackPlugin()

const CONFIG: Configuration = {
  mode: 'production',
  output: {
    clean: true,
    path: '/',
  },
  plugins: [
    /** remove next-line will write disk */
    new VitrualWebpackPlugin(),
    htmlWebpackPluginInstance,
    new (class extends HtmlEnhanceWebpackPlugin {
      apply(compiler: Compiler) {
        super.apply(compiler)

        this.injectTags({
          // inject styles
          styleTags: [
            {
              url: 'https://cdn.dumlj.io/some.css',
            },
          ],
          // inject scripts
          scriptTags: [
            {
              url: 'https://cdn.dumlj.io//some.js',
            },
          ],
          // inject metas
          metaTags: [
            {
              attrs: {
                charset: 'utf-8',
              },
            },
          ],
        })
      }
    })({
      htmlNS: 'index.html',
      HtmlWebpackPlugin,
      htmlWebpackPluginInstance,
    }),
    {
      apply(compiler: Compiler) {
        compiler.hooks.afterDone.tap('use-for-echo-and-ignore-me', (stats) => {
          if (stats.hasErrors()) {
            return
          }

          const files = VitrualWebpackPlugin.files
          ok(`The following is the content of index.html.`, { verbose: false })

          const { '/index.html': index } = files
          // eslint-disable-next-line no-console
          console.log(`\n${index}\n`)
        })
      },
    },
  ],
}

export default CONFIG

## USAGE

```ts
import { HtmlEnhanceWebpackPlugin } from '@dumlj/html-enhance-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const htmlWebpackPluginInstance = new HtmlWebpackPlugin()
const htmlEnhancePluginInstance = new HtmlEnhanceWebpackPlugin({
  /** html filename of output */
  htmlNS: 'index.html',
  /** html-webpack-plugin **/
  HtmlWebpackPlugin: HtmlWebpackPlugin,
  /** instance of html-webpack-plugin */
  htmlWebpackPluginInstance: htmlWebpackPluginInstance,
})

// inject tags anywhrere
htmlEnhancePluginInstance.injectTags({
  scriptTags: [
    {
      url: 'https://cdn.dumlj.io//some.js',
    },
  ],
})

export default {
  // ....
  plugins: [
    htmlWebpackPluginInstance,
    htmlEnhancePluginInstance,
    // inject tags by inheritance
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
        })
      }
    })({
      /** html filename of output */
      htmlNS: 'index.html',
      /** html-webpack-plugin **/
      HtmlWebpackPlugin: HtmlWebpackPlugin,
      /** instance of html-webpack-plugin */
      htmlWebpackPluginInstance: htmlWebpackPluginInstance,
    }),
  ],
}
```

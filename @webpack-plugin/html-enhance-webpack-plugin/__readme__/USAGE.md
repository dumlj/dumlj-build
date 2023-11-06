## USAGE

```ts
import { HtmlEnhanceWebpackPlugin } from '@dumlj/html-enhance-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const htmlWebpackPluginInstance = new HtmlWebpackPlugin()

export default {
  // ....
  plugins: [
    htmlWebpackPluginInstance,
    new HtmlEnhanceWebpackPlugin({
      /** html filename of output */
      htmlNS: 's3',
      /** html-webpack-plugin **/
      HtmlWebpackPlugin: HtmlWebpackPlugin,
      /** instance of html-webpack-plugin */
      htmlWebpackPluginInstance: htmlWebpackPluginInstance,
    }),
  ],
}
```

# HTML 替换插件

```ts
import { OneWebpackHtmlOverridePlugin } from '@dumlj/enhance-html-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const htmlWebpackPluginInstance = new HtmlWebpackPlugin()

export default {
  // ....
  plugins: [
    htmlWebpackPluginInstance,
    new OneWebpackHtmlOverridePlugin({
      /** output */
      htmlNS: 's3',
      /** HtmlWebpackPlugin 插件 **/
      HtmlWebpackPlugin: HtmlWebpackPlugin,
      /** HtmlWebpackPlugin 实例 */
      htmlWebpackPluginInstance: htmlWebpackPluginInstance,
    }),
  ],
}
```

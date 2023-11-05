<!-- This file is dynamically generated. please edit in __readme__ -->

# Enhance Html Webpack Plugin

Enhance html webpack plugin.

## INSTALL

```bash
# use npm
$ npm install --dev @dumlj/enhance-html-webpack-plugin
# use yarn
$ yarn add --dev @dumlj/enhance-html-webpack-plugin
# use pnpm
$ pnpm add @dumlj/enhance-html-webpack-plugin -D
```

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

## INTERNAL DEPENDENCIES

- [@dumlj/seed-webpack-plugin](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/enhance-html-webpack-plugin)
  - [@dumlj/feature-updater](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/enhance-html-webpack-plugin)
    - [@dumlj/shell-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/enhance-html-webpack-plugin)
    - [@dumlj/util-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/enhance-html-webpack-plugin)
    - [@dumlj/mock-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/enhance-html-webpack-plugin)<sup><small>PRIVATE</small></sup>
  - [@dumlj/mock-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/enhance-html-webpack-plugin)<sup><small>PRIVATE</small></sup>

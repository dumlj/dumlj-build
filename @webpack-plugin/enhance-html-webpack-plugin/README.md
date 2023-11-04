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

<pre style="font-family:monospace;"><a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/enhance-html-webpack-plugin" target="_blank">@dumlj/enhance-html-webpack-plugin</a>
└─┬ <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/seed-webpack-plugin" target="_blank">@dumlj/seed-webpack-plugin</a>
  ├─┬─ <a href="https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-updater" target="_blank">@dumlj/feature-updater</a>
  │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/shell-lib" target="_blank">@dumlj/shell-lib</a>
  │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib" target="_blank">@dumlj/util-lib</a>
  │ └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib" target="_blank">@dumlj/mock-lib</a>
  └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib" target="_blank">@dumlj/mock-lib</a></pre>

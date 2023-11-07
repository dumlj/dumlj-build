<!-- This file is dynamically generated. please edit in __readme__ -->

# Html Enhance Webpack Plugin

Basic plugin use for enhance html webpack plugin.

## INSTALL

```bash
# use npm
$ npm install --dev @dumlj/html-enhance-webpack-plugin
# use yarn
$ yarn add --dev @dumlj/html-enhance-webpack-plugin
# use pnpm
$ pnpm add @dumlj/html-enhance-webpack-plugin -D
```

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

## INTERNAL DEPENDENCIES

<pre>
<b>@dumlj/html-enhance-webpack-plugin</b>
└─┬ <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/seed-webpack-plugin">@dumlj/seed-webpack-plugin</a>
  ├─┬─ <a href="https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-updater">@dumlj/feature-updater</a>
  │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/shell-lib">@dumlj/shell-lib</a>
  │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib">@dumlj/util-lib</a>
  │ └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
  └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
</pre>

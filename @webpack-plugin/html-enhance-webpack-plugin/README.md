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

- [@dumlj/seed-webpack-plugin](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/html-enhance-webpack-plugin)
  - [@dumlj/feature-updater](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/html-enhance-webpack-plugin)
    - [@dumlj/shell-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/html-enhance-webpack-plugin)
    - [@dumlj/util-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/html-enhance-webpack-plugin)
    - [@dumlj/mock-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/html-enhance-webpack-plugin)<sup><small>PRIVATE</small></sup>
  - [@dumlj/mock-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/html-enhance-webpack-plugin)<sup><small>PRIVATE</small></sup>

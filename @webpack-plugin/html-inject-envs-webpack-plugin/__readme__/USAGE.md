## USAGE

```ts
import { HtmlInjectEnvsWebpackPlugin } from '@dumlj/html-inject-envs-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const htmlWebpackPluginInstance = new HtmlWebpackPlugin()

export default {
  // ...
  plugins: [
    htmlWebpackPluginInstance,
    new HtmlInjectEnvsWebpackPlugin(
      {
        /** html filename of output */
        htmlNS: 's3',
        /** class of HtmlWebpackPlugin **/
        HtmlWebpackPlugin: HtmlWebpackPlugin,
        /** instnace of HtmlWebpackPlugin */
        htmlWebpackPluginInstance: htmlWebpackPluginInstance,
      },
      // all envirment variables
      {
        APP_ENV: 'production',
      }
    ),
  ],
}
```

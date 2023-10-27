## USAGE

```ts
import { CrxLiveReloadWebpackPlugin } from '@dumlj/crx-live-reload-webpack-plugin'

export default {
  mode: 'development',
  entry: {
    background: path.join(__dirname, 'background.ts'),
    contentScript: path.join(__dirname, 'contentScript.ts'),
  },
  plugins: [
    ...new CrxLiveReloadWebpackPlugin({
      // enter devServer host and port
      // chrome extension can not mount files online.
      host: '127.0.0.1',
      port: 8080,
    }),
  ],
  devServer: {
    hot: true,
    // livereload can not reboot background.js, close it.
    liveReload: false,
    devMiddleware: {
      // as you know
      writeToDisk: true,
    },
  },
}
```

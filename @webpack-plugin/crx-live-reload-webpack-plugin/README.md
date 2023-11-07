<!-- This file is dynamically generated. please edit in __readme__ -->

# Crx Live Reload Webpack Plugin

Livereload over SSE for develop Chrome Extension.

## BACKGROUND

Since Chrome extensions can only load local files, devServer hot reload does not work (only the browser can be reloaded or the scripts can be re-executed remotely). We need to use scripts to make it reload automatically, which contains the `background` and `content-script` modules.

## FEATURE

- Automatically inject reboot scripts.
- Both `background` and `content-script` can use reboot capabilities.

## INSTALL

```bash
# use npm
$ npm install --dev @dumlj/crx-live-reload-webpack-plugin
# use yarn
$ yarn add --dev @dumlj/crx-live-reload-webpack-plugin
# use pnpm
$ pnpm add @dumlj/crx-live-reload-webpack-plugin -D
```

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

## LIVE DEMO

Since I can't Mock Chrome, please open the console to view the logs.😅 And try to change `background.js` or `contentScript.js` files.

Webpack DevServer port is `8080`, Static Server port is `3000`. In real environment, Chrome Extension will mount `./build` folder.

<dumlj-stackblitz height="800px" src="@dumlj-example/crx-live-reload-webpack-plugin"></dumlj-stackblitz>

## INTERNAL DEPENDENCIES

<pre>
<b>@dumlj/crx-live-reload-webpack-plugin</b>
└─┬ <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/crx-live-reload-webpack-plugin">@dumlj/seed-webpack-plugin</a>
  ├─┬─ <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/crx-live-reload-webpack-plugin">@dumlj/feature-updater</a>
  │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/crx-live-reload-webpack-plugin">@dumlj/shell-lib</a>
  │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/crx-live-reload-webpack-plugin">@dumlj/util-lib</a>
  │ └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/crx-live-reload-webpack-plugin">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
  └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/crx-live-reload-webpack-plugin">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
</pre>

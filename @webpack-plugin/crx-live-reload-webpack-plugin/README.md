<!-- This file is dynamically generated. please edit in __readme__ -->

[![License: MIT](https://img.shields.io/badge/License-MIT-4c1.svg)](https://opensource.org/licenses/MIT)&nbsp;
[![Github Repo](https://img.shields.io/badge/GITHUB-REPO-0?logo=github)](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/crx-live-reload-webpack-plugin)&nbsp;
[![dumi](https://img.shields.io/badge/docs%20by-dumi-blue)](https://dumlj.github.io/dumlj-build/docs)&nbsp;
[![NPM Version](https://badge.fury.io/js/@dumlj%2Fcrx-live-reload-webpack-plugin.svg)](https://www.npmjs.com/package/@dumlj/crx-live-reload-webpack-plugin)&nbsp;
[![codecov](https://codecov.io/gh/dumlj/dumlj-build/graph/badge.svg?token=ELV5W1H0C0)](https://codecov.io/gh/dumlj/dumlj-build)&nbsp;

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

<dumlj-stackblitz height="47vw" src="@dumlj-example/crx-live-reload-webpack-plugin"></dumlj-stackblitz>

## INTERNAL DEPENDENCIES

<pre>
<b>@dumlj/crx-live-reload-webpack-plugin</b>
└─┬ <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/seed-webpack-plugin%22,%22version%22:%220.0.1%22,%22description%22:%22Basic%20webpack%20plugins%22,%22isPrivate%22:false,%22location%22:%22@webpack-plugin/seed-webpack-plugin%22,%22dependencies%22:%5B%22@dumlj/feature-updater%22,%22chalk%22,%22tslib%22,%22utility-types%22,%22@dumlj/mock-lib%22,%22@jest/types%22,%22@types/webpack%22,%22ts-jest%22,%22webpack%22%5D,%22workspaceDependencies%22:%5B%22@dumlj/feature-updater%22,%22@dumlj/mock-lib%22%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/seed-webpack-plugin">@dumlj/seed-webpack-plugin</a>
  ├─┬─ <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/feature-updater%22,%22version%22:%220.0.1%22,%22description%22:%22updater%20for%20packages.%22,%22isPrivate%22:false,%22location%22:%22@feature/feature-updater%22,%22dependencies%22:%5B%22@dumlj/shell-lib%22,%22@dumlj/util-lib%22,%22fs-extra%22,%22semver%22,%22tslib%22,%22@dumlj/mock-lib%22,%22ts-jest%22,%22@jest/types%22%5D,%22workspaceDependencies%22:%5B%22@dumlj/shell-lib%22,%22@dumlj/util-lib%22,%22@dumlj/mock-lib%22%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-updater">@dumlj/feature-updater</a>
  │ ├─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/shell-lib%22,%22version%22:%220.0.1%22,%22description%22:%22shell%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/shell-lib%22,%22dependencies%22:%5B%22command-exists%22,%22tslib%22,%22@jest/types%22,%22lodash%22,%22chokidar%22,%22ts-jest%22,%22tsd-lite%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/shell-lib">@dumlj/shell-lib</a>
  │ ├─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/util-lib%22,%22version%22:%220.0.1%22,%22description%22:%22util%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/util-lib%22,%22dependencies%22:%5B%22fs-extra%22,%22glob%22,%22lodash%22,%22tslib%22,%22@jest/types%22,%22memfs%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib">@dumlj/util-lib</a>
  │ └─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/mock-lib%22,%22version%22:%220.0.1%22,%22description%22:%22mock%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:true,%22location%22:%22@lib/mock-lib%22,%22dependencies%22:%5B%22memfs%22,%22tslib%22,%22webpack%22,%22@jest/types%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
  └─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/mock-lib%22,%22version%22:%220.0.1%22,%22description%22:%22mock%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:true,%22location%22:%22@lib/mock-lib%22,%22dependencies%22:%5B%22memfs%22,%22tslib%22,%22webpack%22,%22@jest/types%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
</pre>

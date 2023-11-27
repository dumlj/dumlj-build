<!-- This file is dynamically generated. please edit in __readme__ -->

[![License: MIT](https://img.shields.io/badge/License-MIT-4c1.svg)](https://opensource.org/licenses/MIT)&nbsp;
[![Github Repo](https://img.shields.io/badge/GITHUB-REPO-0?logo=github)](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/html-enhance-webpack-plugin)&nbsp;
<a href="https://www.npmjs.com/package/@dumlj/html-enhance-webpack-plugin"><picture><source srcset="https://badge.fury.io/js/@dumlj%2Fhtml-enhance-webpack-plugin.svg"><img src="https://img.shields.io/badge/NPM-Unpublished-e74c3c" alt="NPM Version"></picture></a>&nbsp;
[![codecov](https://codecov.io/gh/dumlj/dumlj-build/graph/badge.svg?token=ELV5W1H0C0)](https://codecov.io/gh/dumlj/dumlj-build)&nbsp;

# Html Enhance Webpack Plugin

Basic plugin use for enhance html webpack plugin.

## BACKGROUND

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
const htmlEnhancePluginInstance = new HtmlEnhanceWebpackPlugin({
  /** html filename of output */
  htmlNS: 'index.html',
  /** html-webpack-plugin **/
  HtmlWebpackPlugin: HtmlWebpackPlugin,
  /** instance of html-webpack-plugin */
  htmlWebpackPluginInstance: htmlWebpackPluginInstance,
})

// inject tags anywhrere
htmlEnhancePluginInstance.injectTags({
  scriptTags: [
    {
      url: 'https://cdn.dumlj.io//some.js',
    },
  ],
})

export default {
  // ....
  plugins: [
    htmlWebpackPluginInstance,
    htmlEnhancePluginInstance,
    // inject tags by inheritance
    new (class extends HtmlEnhanceWebpackPlugin {
      apply(compiler: Compiler) {
        super.apply(compiler)

        this.injectTags({
          // inject styles
          styleTags: [
            {
              url: 'https://cdn.dumlj.io/some.css',
            },
          ],
        })
      }
    })({
      /** html filename of output */
      htmlNS: 'index.html',
      /** html-webpack-plugin **/
      HtmlWebpackPlugin: HtmlWebpackPlugin,
      /** instance of html-webpack-plugin */
      htmlWebpackPluginInstance: htmlWebpackPluginInstance,
    }),
  ],
}
```

## LIVE DEMO

<dumlj-stackblitz height="47vw" src="@dumlj-example/html-enhance-webpack-plugin"></dumlj-stackblitz>

## INTERNAL DEPENDENCIES

<pre>
<b>@dumlj/html-enhance-webpack-plugin</b>
├─┬ <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/seed-webpack-plugin%22,%22version%22:%220.0.1%22,%22description%22:%22Basic%20webpack%20plugins%22,%22isPrivate%22:false,%22location%22:%22@webpack-plugin/seed-webpack-plugin%22,%22dependencies%22:%5B%22@dumlj/feature-updater%22,%22chalk%22,%22tslib%22,%22utility-types%22,%22@dumlj/mock-lib%22,%22@jest/types%22,%22@types/webpack%22,%22ts-jest%22,%22webpack%22%5D,%22workspaceDependencies%22:%5B%22@dumlj/feature-updater%22,%22@dumlj/mock-lib%22%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/seed-webpack-plugin">@dumlj/seed-webpack-plugin</a>
│ ├─┬─ <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/feature-updater%22,%22version%22:%220.0.1%22,%22description%22:%22updater%20for%20packages.%22,%22isPrivate%22:false,%22location%22:%22@feature/feature-updater%22,%22dependencies%22:%5B%22@dumlj/shell-lib%22,%22@dumlj/util-lib%22,%22fs-extra%22,%22semver%22,%22tslib%22,%22@dumlj/mock-lib%22,%22ts-jest%22,%22@jest/types%22%5D,%22workspaceDependencies%22:%5B%22@dumlj/shell-lib%22,%22@dumlj/util-lib%22,%22@dumlj/mock-lib%22%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-updater">@dumlj/feature-updater</a>
│ │ ├─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/shell-lib%22,%22version%22:%220.0.1%22,%22description%22:%22shell%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/shell-lib%22,%22dependencies%22:%5B%22command-exists%22,%22tslib%22,%22@jest/types%22,%22lodash%22,%22chokidar%22,%22ts-jest%22,%22tsd-lite%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/shell-lib">@dumlj/shell-lib</a>
│ │ ├─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/util-lib%22,%22version%22:%220.0.1%22,%22description%22:%22util%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/util-lib%22,%22dependencies%22:%5B%22fs-extra%22,%22glob%22,%22lodash%22,%22tslib%22,%22@jest/types%22,%22memfs%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib">@dumlj/util-lib</a>
│ │ └─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/mock-lib%22,%22version%22:%220.0.1%22,%22description%22:%22mock%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:true,%22location%22:%22@lib/mock-lib%22,%22dependencies%22:%5B%22memfs%22,%22tslib%22,%22webpack%22,%22@jest/types%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
│ └─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/mock-lib%22,%22version%22:%220.0.1%22,%22description%22:%22mock%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:true,%22location%22:%22@lib/mock-lib%22,%22dependencies%22:%5B%22memfs%22,%22tslib%22,%22webpack%22,%22@jest/types%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
└── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/util-lib%22,%22version%22:%220.0.1%22,%22description%22:%22util%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/util-lib%22,%22dependencies%22:%5B%22fs-extra%22,%22glob%22,%22lodash%22,%22tslib%22,%22@jest/types%22,%22memfs%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib">@dumlj/util-lib</a>
</pre>

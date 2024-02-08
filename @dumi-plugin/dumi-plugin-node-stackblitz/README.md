<!-- This file is dynamically generated. please edit in __readme__ -->

[![License: MIT](https://img.shields.io/badge/License-MIT-4c1.svg)](https://opensource.org/licenses/MIT)&nbsp;
[![Github Repo](https://img.shields.io/badge/GITHUB-REPO-0?logo=github)](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/dumi-plugin-node-stackblitz)&nbsp;
[![NPM Version](https://badge.fury.io/js/@dumlj%2Fdumi-plugin-node-stackblitz.svg)](https://www.npmjs.com/package/@dumlj/dumi-plugin-node-stackblitz)&nbsp;
[![See Docs](https://img.shields.io/badge/see-docs-blue?logo=dumi&logoColor=green)](https://dumlj.github.io/dumlj-build/docs)&nbsp;
[![codecov](https://codecov.io/gh/dumlj/dumlj-build/graph/badge.svg?token=ELV5W1H0C0)](https://codecov.io/gh/dumlj/dumlj-build)&nbsp;
[![DeepSource](https://app.deepsource.com/gh/dumlj/dumlj-build.svg/?label=active+issues&show_trend=true&token=YtSFFZ702Q016pjWlBWT30Iy)](https://app.deepsource.com/gh/dumlj/dumlj-build/)&nbsp;

# Dumi Plugin Node Stackblitz

Supports live demo of node powered by stackblitz.

## BACKGROUND

Because Dumi only supports React/Vue demo, Node modules like this project cannot implement online demo in Dumi official. So this plugin will help you create node demo and without release to github and support private repo.

## FEATURE

- support monorepo.
- support private repo.
- Node packages live demo.
- selectively upload dependent modules in monorepo.

## INSTALL

```bash
# use npm
$ npm install --dev @dumlj/dumi-plugin-node-stackblitz
# use yarn
$ yarn add --dev @dumlj/dumi-plugin-node-stackblitz
# use pnpm
$ pnpm add @dumlj/dumi-plugin-node-stackblitz -D
```

## USAGE

```ts
import { defineConfig } from 'dumi'
export default defineConfig({
  // ...
  nodeStackblitz: {
    // something to configure
    ignored: ['**/__tests__/**'],
  },
  plugins: [require.resolve('@dumlj/dumi-plugin-node-stackblitz')],
})
```

## LIVE DEMO

See this docs website... 🤠

## INTERNAL DEPENDENCIES

<pre>
<b>@dumlj/dumi-plugin-node-stackblitz</b>
├─┬ <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/dumi-plugin-seed%22,%22version%22:%222.5.22%22,%22description%22:%22Basic%20dumi%20plugin%22,%22isPrivate%22:true,%22location%22:%22@dumi-plugin/dumi-plugin-seed%22,%22dependencies%22:%5B%22@dumlj/feature-updater%22,%22@dumlj/util-lib%22,%22chalk%22,%22lodash%22,%22node-html-parser%22,%22remark-directive%22,%22remark-frontmatter%22,%22remark-gfm%22,%22remark-parse%22,%22tslib%22,%22unified%22,%22utility-types%22,%22webpack%22,%22webpack-virtual-modules%22,%22@jest/types%22,%22ts-jest%22,%22dumi%22%5D,%22workspaceDependencies%22:%5B%22@dumlj/feature-updater%22,%22@dumlj/util-lib%22%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@dumi-plugin/dumi-plugin-seed">@dumlj/dumi-plugin-seed</a><sup><small><i>PRIVATE</i></small></sup>
│ ├─┬─ <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/feature-updater%22,%22version%22:%222.5.22%22,%22description%22:%22updater%20for%20packages.%22,%22isPrivate%22:false,%22location%22:%22@feature/feature-updater%22,%22dependencies%22:%5B%22@dumlj/shell-lib%22,%22@dumlj/util-lib%22,%22fs-extra%22,%22semver%22,%22tslib%22,%22@dumlj/mock-lib%22,%22@jest/types%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%22@dumlj/shell-lib%22,%22@dumlj/util-lib%22,%22@dumlj/mock-lib%22%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-updater">@dumlj/feature-updater</a>
│ │ ├─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/shell-lib%22,%22version%22:%222.5.22%22,%22description%22:%22shell%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/shell-lib%22,%22dependencies%22:%5B%22@jest/types%22,%22chokidar%22,%22command-exists%22,%22lodash%22,%22tslib%22,%22ts-jest%22,%22tsd-lite%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/shell-lib">@dumlj/shell-lib</a>
│ │ ├─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/util-lib%22,%22version%22:%222.5.22%22,%22description%22:%22util%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/util-lib%22,%22dependencies%22:%5B%22fs-extra%22,%22glob%22,%22tslib%22,%22@jest/types%22,%22memfs%22,%22ts-jest%22,%22unified%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib">@dumlj/util-lib</a>
│ │ └─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/mock-lib%22,%22version%22:%222.5.22%22,%22description%22:%22mock%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:true,%22location%22:%22@lib/mock-lib%22,%22dependencies%22:%5B%22memfs%22,%22tslib%22,%22webpack%22,%22@jest/types%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
│ └─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/util-lib%22,%22version%22:%222.5.22%22,%22description%22:%22util%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/util-lib%22,%22dependencies%22:%5B%22fs-extra%22,%22glob%22,%22tslib%22,%22@jest/types%22,%22memfs%22,%22ts-jest%22,%22unified%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib">@dumlj/util-lib</a>
└─┬ <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/stackblitz-webpack-plugin%22,%22version%22:%222.5.22%22,%22description%22:%22Online%20demo%20of%20stackblitz%20implementation.%22,%22isPrivate%22:false,%22location%22:%22@webpack-plugin/stackblitz-webpack-plugin%22,%22dependencies%22:%5B%22@dumlj/inject-entry-script-webpack-plugin%22,%22@dumlj/seed-webpack-plugin%22,%22@dumlj/util-lib%22,%22@stackblitz/sdk%22,%22fs-extra%22,%22glob%22,%22jszip%22,%22lodash%22,%22tslib%22,%22utility-types%22,%22@jest/types%22,%22@types/webpack%22,%22ts-jest%22,%22webpack%22%5D,%22workspaceDependencies%22:%5B%22@dumlj/inject-entry-script-webpack-plugin%22,%22@dumlj/seed-webpack-plugin%22,%22@dumlj/util-lib%22%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/stackblitz-webpack-plugin">@dumlj/stackblitz-webpack-plugin</a>
  ├─┬─ <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/inject-entry-script-webpack-plugin%22,%22version%22:%222.5.22%22,%22description%22:%22Append%20or%20prepend%20scripts%20to%20entries.%22,%22isPrivate%22:false,%22location%22:%22@webpack-plugin/inject-entry-script-webpack-plugin%22,%22dependencies%22:%5B%22@dumlj/seed-webpack-plugin%22,%22tslib%22,%22@jest/types%22,%22@types/webpack%22,%22ts-jest%22,%22webpack%22%5D,%22workspaceDependencies%22:%5B%22@dumlj/seed-webpack-plugin%22%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/inject-entry-script-webpack-plugin">@dumlj/inject-entry-script-webpack-plugin</a>
  │ └─┬─ <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/seed-webpack-plugin%22,%22version%22:%222.5.22%22,%22description%22:%22Basic%20webpack%20plugins%22,%22isPrivate%22:false,%22location%22:%22@webpack-plugin/seed-webpack-plugin%22,%22dependencies%22:%5B%22@dumlj/feature-updater%22,%22chalk%22,%22tslib%22,%22utility-types%22,%22@dumlj/mock-lib%22,%22@jest/types%22,%22@types/webpack%22,%22ts-jest%22,%22webpack%22%5D,%22workspaceDependencies%22:%5B%22@dumlj/feature-updater%22,%22@dumlj/mock-lib%22%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/seed-webpack-plugin">@dumlj/seed-webpack-plugin</a>
  │ │ ├─┬─ <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/feature-updater%22,%22version%22:%222.5.22%22,%22description%22:%22updater%20for%20packages.%22,%22isPrivate%22:false,%22location%22:%22@feature/feature-updater%22,%22dependencies%22:%5B%22@dumlj/shell-lib%22,%22@dumlj/util-lib%22,%22fs-extra%22,%22semver%22,%22tslib%22,%22@dumlj/mock-lib%22,%22@jest/types%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%22@dumlj/shell-lib%22,%22@dumlj/util-lib%22,%22@dumlj/mock-lib%22%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-updater">@dumlj/feature-updater</a>
  │ │ │ ├─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/shell-lib%22,%22version%22:%222.5.22%22,%22description%22:%22shell%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/shell-lib%22,%22dependencies%22:%5B%22@jest/types%22,%22chokidar%22,%22command-exists%22,%22lodash%22,%22tslib%22,%22ts-jest%22,%22tsd-lite%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/shell-lib">@dumlj/shell-lib</a>
  │ │ │ ├─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/util-lib%22,%22version%22:%222.5.22%22,%22description%22:%22util%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/util-lib%22,%22dependencies%22:%5B%22fs-extra%22,%22glob%22,%22tslib%22,%22@jest/types%22,%22memfs%22,%22ts-jest%22,%22unified%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib">@dumlj/util-lib</a>
  │ │ │ └─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/mock-lib%22,%22version%22:%222.5.22%22,%22description%22:%22mock%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:true,%22location%22:%22@lib/mock-lib%22,%22dependencies%22:%5B%22memfs%22,%22tslib%22,%22webpack%22,%22@jest/types%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
  │ │ └─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/mock-lib%22,%22version%22:%222.5.22%22,%22description%22:%22mock%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:true,%22location%22:%22@lib/mock-lib%22,%22dependencies%22:%5B%22memfs%22,%22tslib%22,%22webpack%22,%22@jest/types%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
  ├─┬─ <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/seed-webpack-plugin%22,%22version%22:%222.5.22%22,%22description%22:%22Basic%20webpack%20plugins%22,%22isPrivate%22:false,%22location%22:%22@webpack-plugin/seed-webpack-plugin%22,%22dependencies%22:%5B%22@dumlj/feature-updater%22,%22chalk%22,%22tslib%22,%22utility-types%22,%22@dumlj/mock-lib%22,%22@jest/types%22,%22@types/webpack%22,%22ts-jest%22,%22webpack%22%5D,%22workspaceDependencies%22:%5B%22@dumlj/feature-updater%22,%22@dumlj/mock-lib%22%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/seed-webpack-plugin">@dumlj/seed-webpack-plugin</a>
  │ ├─┬─ <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/feature-updater%22,%22version%22:%222.5.22%22,%22description%22:%22updater%20for%20packages.%22,%22isPrivate%22:false,%22location%22:%22@feature/feature-updater%22,%22dependencies%22:%5B%22@dumlj/shell-lib%22,%22@dumlj/util-lib%22,%22fs-extra%22,%22semver%22,%22tslib%22,%22@dumlj/mock-lib%22,%22@jest/types%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%22@dumlj/shell-lib%22,%22@dumlj/util-lib%22,%22@dumlj/mock-lib%22%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-updater">@dumlj/feature-updater</a>
  │ │ ├─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/shell-lib%22,%22version%22:%222.5.22%22,%22description%22:%22shell%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/shell-lib%22,%22dependencies%22:%5B%22@jest/types%22,%22chokidar%22,%22command-exists%22,%22lodash%22,%22tslib%22,%22ts-jest%22,%22tsd-lite%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/shell-lib">@dumlj/shell-lib</a>
  │ │ ├─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/util-lib%22,%22version%22:%222.5.22%22,%22description%22:%22util%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/util-lib%22,%22dependencies%22:%5B%22fs-extra%22,%22glob%22,%22tslib%22,%22@jest/types%22,%22memfs%22,%22ts-jest%22,%22unified%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib">@dumlj/util-lib</a>
  │ │ └─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/mock-lib%22,%22version%22:%222.5.22%22,%22description%22:%22mock%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:true,%22location%22:%22@lib/mock-lib%22,%22dependencies%22:%5B%22memfs%22,%22tslib%22,%22webpack%22,%22@jest/types%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
  │ └─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/mock-lib%22,%22version%22:%222.5.22%22,%22description%22:%22mock%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:true,%22location%22:%22@lib/mock-lib%22,%22dependencies%22:%5B%22memfs%22,%22tslib%22,%22webpack%22,%22@jest/types%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
  └─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/util-lib%22,%22version%22:%222.5.22%22,%22description%22:%22util%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/util-lib%22,%22dependencies%22:%5B%22fs-extra%22,%22glob%22,%22tslib%22,%22@jest/types%22,%22memfs%22,%22ts-jest%22,%22unified%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib">@dumlj/util-lib</a>
</pre>

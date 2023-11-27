<!-- This file is dynamically generated. please edit in __readme__ -->

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)&nbsp;
[![Github Repo](https://img.shields.io/badge/GITHUB-REPO-0?logo=github)](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/dumi-plugin-mono-readme)&nbsp;
<a href="https://www.npmjs.com/package/@dumlj/dumi-plugin-mono-readme"><picture><source srcset="https://badge.fury.io/js/@dumlj%2Fdumi-plugin-mono-readme.svg"><img src="https://img.shields.io/badge/NPM-Unpublished-e74c3c" alt="NPM Version"></picture></a>&nbsp;
[![codecov](https://codecov.io/gh/dumlj/dumlj-build/graph/badge.svg?token=ELV5W1H0C0)](https://codecov.io/gh/dumlj/dumlj-build)&nbsp;

# Dumi Plugin Mono Readme

Support referencing for readme file of monorepo.

## BACKGROUND

In the monorepo project, the projects have certain standard, and there are a lot of repeated descriptions in the README.md, such as dependency installation, writing project titles and descriptions, etc.
Therefore, we can render the README.md dynamically, thereby reducing document writing and finally pushed to Dumi.

## FEATURE

- dynamic generate docs.
- support tempalte files.
- support dynamic variables.
- support monorepo.

## INSTALL

```bash
# use npm
$ npm install --dev @dumlj/dumi-plugin-mono-readme
# use yarn
$ yarn add --dev @dumlj/dumi-plugin-mono-readme
# use pnpm
$ pnpm add @dumlj/dumi-plugin-mono-readme -D
```

## USAGE

You can create `__readme__` folder and write `*.md` to merge and render docs.
The default file name and file order is `TITLE`, `BACKGROUND`, `FEATURE`, `INSTALL`, `USAGE`, `DEMO`, `CONTRIBUTING`

```ts
import { defineConfig } from 'dumi'
export default defineConfig({
  // ...
  plugins: [require.resolve('@dumlj/dumi-plugin-mono-readme')],
})
```

## LIVE DEMO

See this docs website... 🤠

## INTERNAL DEPENDENCIES

<pre>
<b>@dumlj/dumi-plugin-mono-readme</b>
├─┬ <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/dumi-plugin-seed%22,%22version%22:%220.0.1%22,%22description%22:%22Basic%20dumi%20plugin%22,%22isPrivate%22:true,%22location%22:%22@dumi-plugin/dumi-plugin-seed%22,%22dependencies%22:%5B%22@dumlj/feature-updater%22,%22chalk%22,%22lodash%22,%22node-html-parser%22,%22tslib%22,%22utility-types%22,%22webpack%22,%22webpack-virtual-modules%22,%22@dumlj/util-lib%22,%22@jest/types%22,%22ts-jest%22,%22dumi%22%5D,%22workspaceDependencies%22:%5B%22@dumlj/feature-updater%22,%22@dumlj/util-lib%22%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@dumi-plugin/dumi-plugin-seed">@dumlj/dumi-plugin-seed</a><sup><small><i>PRIVATE</i></small></sup>
│ ├─┬─ <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/feature-updater%22,%22version%22:%220.0.1%22,%22description%22:%22updater%20for%20packages.%22,%22isPrivate%22:false,%22location%22:%22@feature/feature-updater%22,%22dependencies%22:%5B%22@dumlj/shell-lib%22,%22@dumlj/util-lib%22,%22fs-extra%22,%22semver%22,%22tslib%22,%22@dumlj/mock-lib%22,%22ts-jest%22,%22@jest/types%22%5D,%22workspaceDependencies%22:%5B%22@dumlj/shell-lib%22,%22@dumlj/util-lib%22,%22@dumlj/mock-lib%22%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-updater">@dumlj/feature-updater</a>
│ │ ├─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/shell-lib%22,%22version%22:%220.0.1%22,%22description%22:%22shell%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/shell-lib%22,%22dependencies%22:%5B%22command-exists%22,%22tslib%22,%22@jest/types%22,%22lodash%22,%22chokidar%22,%22ts-jest%22,%22tsd-lite%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/shell-lib">@dumlj/shell-lib</a>
│ │ ├─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/util-lib%22,%22version%22:%220.0.1%22,%22description%22:%22util%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/util-lib%22,%22dependencies%22:%5B%22fs-extra%22,%22glob%22,%22lodash%22,%22tslib%22,%22@jest/types%22,%22memfs%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib">@dumlj/util-lib</a>
│ │ └─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/mock-lib%22,%22version%22:%220.0.1%22,%22description%22:%22mock%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:true,%22location%22:%22@lib/mock-lib%22,%22dependencies%22:%5B%22memfs%22,%22tslib%22,%22webpack%22,%22@jest/types%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
│ └─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/util-lib%22,%22version%22:%220.0.1%22,%22description%22:%22util%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/util-lib%22,%22dependencies%22:%5B%22fs-extra%22,%22glob%22,%22lodash%22,%22tslib%22,%22@jest/types%22,%22memfs%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib">@dumlj/util-lib</a>
├─┬ <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/feature-readme%22,%22version%22:%220.0.1%22,%22description%22:%22%E4%B8%8A%E8%89%B2%E5%B7%A5%E5%85%B7%22,%22isPrivate%22:false,%22location%22:%22@feature/feature-readme%22,%22dependencies%22:%5B%22@dumlj/feature-prepare%22,%22@dumlj/util-lib%22,%22fs-extra%22,%22handlebars%22,%22lodash%22,%22micromatch%22,%22tslib%22,%22@jest/types%22,%22memfs%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%22@dumlj/feature-prepare%22,%22@dumlj/util-lib%22%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-readme">@dumlj/feature-readme</a>
│ ├─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/feature-prepare%22,%22version%22:%220.0.1%22,%22description%22:%22%E4%BB%A3%E7%A0%81%E6%BA%90%E6%96%87%E4%BB%B6%E9%A2%84%E5%A4%84%E7%90%86%E5%B7%A5%E5%85%B7%22,%22isPrivate%22:false,%22location%22:%22@feature/feature-prepare%22,%22dependencies%22:%5B%22fs-extra%22,%22get-tsconfig%22,%22interpret%22,%22rechoir%22,%22@jest/types%22,%22memfs%22,%22ts-jest%22,%22tslib%22,%22ts-node%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-prepare">@dumlj/feature-prepare</a>
│ └─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/util-lib%22,%22version%22:%220.0.1%22,%22description%22:%22util%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/util-lib%22,%22dependencies%22:%5B%22fs-extra%22,%22glob%22,%22lodash%22,%22tslib%22,%22@jest/types%22,%22memfs%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib">@dumlj/util-lib</a>
└─┬ <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/inject-entry-script-webpack-plugin%22,%22version%22:%220.0.1%22,%22description%22:%22Append%20or%20prepend%20scripts%20to%20entries.%22,%22isPrivate%22:false,%22location%22:%22@webpack-plugin/inject-entry-script-webpack-plugin%22,%22dependencies%22:%5B%22@dumlj/seed-webpack-plugin%22,%22tslib%22,%22@jest/types%22,%22@types/webpack%22,%22ts-jest%22,%22webpack%22%5D,%22workspaceDependencies%22:%5B%22@dumlj/seed-webpack-plugin%22%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/inject-entry-script-webpack-plugin">@dumlj/inject-entry-script-webpack-plugin</a>
  └─┬─ <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/seed-webpack-plugin%22,%22version%22:%220.0.1%22,%22description%22:%22Basic%20webpack%20plugins%22,%22isPrivate%22:false,%22location%22:%22@webpack-plugin/seed-webpack-plugin%22,%22dependencies%22:%5B%22@dumlj/feature-updater%22,%22chalk%22,%22tslib%22,%22utility-types%22,%22@dumlj/mock-lib%22,%22@jest/types%22,%22@types/webpack%22,%22ts-jest%22,%22webpack%22%5D,%22workspaceDependencies%22:%5B%22@dumlj/feature-updater%22,%22@dumlj/mock-lib%22%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/seed-webpack-plugin">@dumlj/seed-webpack-plugin</a>
  │ ├─┬─ <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/feature-updater%22,%22version%22:%220.0.1%22,%22description%22:%22updater%20for%20packages.%22,%22isPrivate%22:false,%22location%22:%22@feature/feature-updater%22,%22dependencies%22:%5B%22@dumlj/shell-lib%22,%22@dumlj/util-lib%22,%22fs-extra%22,%22semver%22,%22tslib%22,%22@dumlj/mock-lib%22,%22ts-jest%22,%22@jest/types%22%5D,%22workspaceDependencies%22:%5B%22@dumlj/shell-lib%22,%22@dumlj/util-lib%22,%22@dumlj/mock-lib%22%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-updater">@dumlj/feature-updater</a>
  │ │ ├─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/shell-lib%22,%22version%22:%220.0.1%22,%22description%22:%22shell%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/shell-lib%22,%22dependencies%22:%5B%22command-exists%22,%22tslib%22,%22@jest/types%22,%22lodash%22,%22chokidar%22,%22ts-jest%22,%22tsd-lite%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/shell-lib">@dumlj/shell-lib</a>
  │ │ ├─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/util-lib%22,%22version%22:%220.0.1%22,%22description%22:%22util%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/util-lib%22,%22dependencies%22:%5B%22fs-extra%22,%22glob%22,%22lodash%22,%22tslib%22,%22@jest/types%22,%22memfs%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib">@dumlj/util-lib</a>
  │ │ └─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/mock-lib%22,%22version%22:%220.0.1%22,%22description%22:%22mock%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:true,%22location%22:%22@lib/mock-lib%22,%22dependencies%22:%5B%22memfs%22,%22tslib%22,%22webpack%22,%22@jest/types%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
  │ └─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/mock-lib%22,%22version%22:%220.0.1%22,%22description%22:%22mock%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:true,%22location%22:%22@lib/mock-lib%22,%22dependencies%22:%5B%22memfs%22,%22tslib%22,%22webpack%22,%22@jest/types%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
</pre>

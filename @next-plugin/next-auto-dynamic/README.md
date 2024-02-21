<!-- This file is dynamically generated. please edit in __readme__ -->

[![License: MIT](https://img.shields.io/badge/License-MIT-4c1.svg)](https://opensource.org/licenses/MIT)&nbsp;
[![Github Repo](https://img.shields.io/badge/GITHUB-REPO-0?logo=github)](https://github.com/dumlj/dumlj-build/tree/main/@next-plugin/next-auto-dynamic)&nbsp;
[![NPM Version](https://badge.fury.io/js/@dumlj%2Fnext-auto-dynamic.svg)](https://www.npmjs.com/package/@dumlj/next-auto-dynamic)&nbsp;
[![See Docs](https://img.shields.io/badge/see-docs-blue?logo=dumi&logoColor=green)](https://dumlj.github.io/dumlj-build/docs)&nbsp;
[![codecov](https://codecov.io/gh/dumlj/dumlj-build/graph/badge.svg?token=ELV5W1H0C0)](https://codecov.io/gh/dumlj/dumlj-build)&nbsp;

# Next Auto Dynamic

code-splitting in app router automatically.

## BACKGROUND

When using the NextJS App Router, it is currently not possible to use `next/dynamic` for code splitting within Server Components. This necessitates calling `next/dynamic` within Client Components, leading to an extra layer of reference wrapping in the code. This plugin was primarily created to enhance the development experience by providing a convention-based approach to virtually wrap client components, thereby achieving code splitting.

For more discussion on this issue, refer to this [ISSUE link](https://github.com/vercel/next.js/issues/49454#issuecomment-1830053413).

This plugin has been developed to supplement features currently lacking in the official release. Should the official development team implement these code-splitting capabilities, the maintenance and development of this plugin will be discontinued.

## Features

- **No Manual Code Splitting Required**: This plugin eliminates the need for manually creating client components for code splitting.

## INSTALL

```bash
# use npm
$ npm install --dev @dumlj/next-auto-dynamic
# use yarn
$ yarn add --dev @dumlj/next-auto-dynamic
# use pnpm
$ pnpm add @dumlj/next-auto-dynamic -D
```

## USAGE

```js
/* eslint import/no-extraneous-dependencies: "off" */
/** @type {import('@dumlj/next-auto-dynamic').nextDynamicClient} */
const { nextDynamicClient } = require('@dumlj/next-auto-dynamic')
const withDynamicClient = nextDynamicClient({
  src: './snippets',
  include: ['**/*.tsx'],
  exclude: ['**/*.ts'],
})

/** @type {import('next').NextConfig} */
const nextConfig = {}
module.exports = withDynamicClient(nextConfig)
```

## LIVE DEMO

You can view static file loading by refreshing the page and opening the console.

<dumlj-stackblitz height="47vw" src="@dumlj-example/next-auto-dynamic"></dumlj-stackblitz>

## INTERNAL DEPENDENCIES

<pre>
<b>@dumlj/next-auto-dynamic</b>
└─┬ <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/seed-webpack-plugin%22,%22version%22:%222.5.23%22,%22description%22:%22Basic%20webpack%20plugins%22,%22isPrivate%22:false,%22location%22:%22@webpack-plugin/seed-webpack-plugin%22,%22dependencies%22:%5B%22@dumlj/feature-updater%22,%22chalk%22,%22tslib%22,%22utility-types%22,%22@dumlj/mock-lib%22,%22@jest/types%22,%22@types/webpack%22,%22ts-jest%22,%22webpack%22%5D,%22workspaceDependencies%22:%5B%22@dumlj/feature-updater%22,%22@dumlj/mock-lib%22%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/seed-webpack-plugin">@dumlj/seed-webpack-plugin</a>
  ├─┬─ <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/feature-updater%22,%22version%22:%222.5.23%22,%22description%22:%22updater%20for%20packages.%22,%22isPrivate%22:false,%22location%22:%22@feature/feature-updater%22,%22dependencies%22:%5B%22@dumlj/shell-lib%22,%22@dumlj/util-lib%22,%22fs-extra%22,%22semver%22,%22tslib%22,%22@dumlj/mock-lib%22,%22@jest/types%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%22@dumlj/shell-lib%22,%22@dumlj/util-lib%22,%22@dumlj/mock-lib%22%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-updater">@dumlj/feature-updater</a>
  │ ├─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/shell-lib%22,%22version%22:%222.5.23%22,%22description%22:%22shell%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/shell-lib%22,%22dependencies%22:%5B%22@jest/types%22,%22chokidar%22,%22command-exists%22,%22lodash%22,%22tslib%22,%22ts-jest%22,%22tsd-lite%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/shell-lib">@dumlj/shell-lib</a>
  │ ├─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/util-lib%22,%22version%22:%222.5.23%22,%22description%22:%22util%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/util-lib%22,%22dependencies%22:%5B%22fs-extra%22,%22glob%22,%22tslib%22,%22@jest/types%22,%22memfs%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib">@dumlj/util-lib</a>
  │ └─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/mock-lib%22,%22version%22:%222.5.23%22,%22description%22:%22mock%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:true,%22location%22:%22@lib/mock-lib%22,%22dependencies%22:%5B%22memfs%22,%22tslib%22,%22webpack%22,%22@jest/types%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
  └─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/mock-lib%22,%22version%22:%222.5.23%22,%22description%22:%22mock%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:true,%22location%22:%22@lib/mock-lib%22,%22dependencies%22:%5B%22memfs%22,%22tslib%22,%22webpack%22,%22@jest/types%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
</pre>

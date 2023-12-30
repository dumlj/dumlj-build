<!-- This file is dynamically generated. please edit in __readme__ -->

[![License: MIT](https://img.shields.io/badge/License-MIT-4c1.svg)](https://opensource.org/licenses/MIT)&nbsp;
[![Github Repo](https://img.shields.io/badge/GITHUB-REPO-0?logo=github)](https://github.com/dumlj/dumlj-build/tree/main/@vite-plugin/vite-plugin-seed)&nbsp;
[![NPM Version](https://badge.fury.io/js/@dumlj%2Fvite-plugin-seed.svg)](https://www.npmjs.com/package/@dumlj/vite-plugin-seed)&nbsp;
[![See Docs](https://img.shields.io/badge/see-docs-blue?logo=dumi&logoColor=green)](https://dumlj.github.io/dumlj-build/docs)&nbsp;
[![codecov](https://codecov.io/gh/dumlj/dumlj-build/graph/badge.svg?token=ELV5W1H0C0)](https://codecov.io/gh/dumlj/dumlj-build)&nbsp;
[![DeepSource](https://app.deepsource.com/gh/dumlj/dumlj-build.svg/?label=active+issues&show_trend=true&token=YtSFFZ702Q016pjWlBWT30Iy)](https://app.deepsource.com/gh/dumlj/dumlj-build/)&nbsp;

# Vite Plugin Seed

Basic vite plugin.

## BACKGROUND

To avoid repeated writing of basic capabilities, this basic plug-in is specially used to build basic capabilities.

## FEATURE

- Support logger log service.
- Support update service.

## INSTALL

```bash
# use npm
$ npm install --dev @dumlj/vite-plugin-seed
# use yarn
$ yarn add --dev @dumlj/vite-plugin-seed
# use pnpm
$ pnpm add @dumlj/vite-plugin-seed -D
```

## USAGE

```ts
import { connect, createVitePlugin, vitePlugin } from '@dumlj/vite-plugin-seed'

export const oneVitePluginDemo = connect(
  createVitePlugin('vite-plugin-demo', (custom?: string) => ({ logger, helper }) => {
    const instance = vitePlugin()
    // todo something...

    return {
      ...instance,
    }
  })
)
```

### Expand enhances

```ts
import { enhance, createVitePlugin, vitePlugin } from '@dumlj/vite-plugin-seed'
const { connect } = enhance({
  myEnhance: () => ({ hello: 'world' }),
})

export default connect(
  createVitePlugin('vite-plugin-demo', () => ({ hello }) => {
    const instance = vitePlugin()
    console.log(hello())
    return { ...instance }
  })
)
```

## INTERNAL DEPENDENCIES

<pre>
<b>@dumlj/vite-plugin-seed</b>
└─┬ <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/feature-updater%22,%22version%22:%222.5.20%22,%22description%22:%22updater%20for%20packages.%22,%22isPrivate%22:false,%22location%22:%22@feature/feature-updater%22,%22dependencies%22:%5B%22@dumlj/shell-lib%22,%22@dumlj/util-lib%22,%22fs-extra%22,%22semver%22,%22tslib%22,%22@dumlj/mock-lib%22,%22@jest/types%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%22@dumlj/shell-lib%22,%22@dumlj/util-lib%22,%22@dumlj/mock-lib%22%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-updater">@dumlj/feature-updater</a>
  ├─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/shell-lib%22,%22version%22:%222.5.20%22,%22description%22:%22shell%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/shell-lib%22,%22dependencies%22:%5B%22@jest/types%22,%22chokidar%22,%22command-exists%22,%22lodash%22,%22tslib%22,%22ts-jest%22,%22tsd-lite%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/shell-lib">@dumlj/shell-lib</a>
  ├─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/util-lib%22,%22version%22:%222.5.20%22,%22description%22:%22util%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/util-lib%22,%22dependencies%22:%5B%22fs-extra%22,%22glob%22,%22lodash%22,%22tslib%22,%22@jest/types%22,%22memfs%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib">@dumlj/util-lib</a>
  └─── <a is="dumlj-link" data-project="%7B%22name%22:%22@dumlj/mock-lib%22,%22version%22:%222.5.20%22,%22description%22:%22mock%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:true,%22location%22:%22@lib/mock-lib%22,%22dependencies%22:%5B%22memfs%22,%22tslib%22,%22webpack%22,%22@jest/types%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D" href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
</pre>

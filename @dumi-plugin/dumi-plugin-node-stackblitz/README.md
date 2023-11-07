<!-- This file is dynamically generated. please edit in __readme__ -->

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
├─┬ <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/stackblitz-webpack-plugin">@dumlj/stackblitz-webpack-plugin</a>
│ ├─┬─ <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/seed-webpack-plugin">@dumlj/seed-webpack-plugin</a>
│ │ ├─┬─ <a href="https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-updater">@dumlj/feature-updater</a>
│ │ │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/shell-lib">@dumlj/shell-lib</a>
│ │ │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib">@dumlj/util-lib</a>
│ │ │ └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
│ │ └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
│ └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib">@dumlj/util-lib</a>
└─┬ <a href="https://github.com/dumlj/dumlj-build/tree/main/@dumi-plugin/dumi-plugin-seed">@dumlj/dumi-plugin-seed</a><sup><small><i>PRIVATE</i></small></sup>
  └─┬─ <a href="https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-updater">@dumlj/feature-updater</a>
  │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/shell-lib">@dumlj/shell-lib</a>
  │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib">@dumlj/util-lib</a>
  │ └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
</pre>

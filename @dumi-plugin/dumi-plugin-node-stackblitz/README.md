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

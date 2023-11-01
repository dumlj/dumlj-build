<!-- This file is dynamically generated. please edit in __readme__ -->

# Stackblitz Webpack Plugin

Online demo of stackblitz implementation.

## BACKGROUND

The node project is difficult to use Stackblitz to create online demo (Requires an open source platform or project). And in some Monorepo project, some private libraries are not release to NPM, so it difficult to create demo with Stackblitz. This plug-in mainly helps users write Stackblitz demo locally or online.

## FEATURE

- support monorepo.
- support private repo.
- Node packages live demo.
- selectively upload dependent modules in monorepo.

## INSTALL

```bash
# use npm
$ npm install --dev @dumlj/stackblitz-webpack-plugin
# use yarn
$ yarn add --dev @dumlj/stackblitz-webpack-plugin
# use pnpm
$ pnpm add @dumlj/stackblitz-webpack-plugin -D
```

## USAGE

```ts
import { StackblitzWebpackPlugin } from '@dumlj/stackblitz-webpack-plugin'

export default {
  plugins: [
    new StackblitzWebpackPlugin({
      // something to configure
      ignored: ['**/__tests__/**'],
    }),
  ],
}
```
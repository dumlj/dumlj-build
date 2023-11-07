<!-- This file is dynamically generated. please edit in __readme__ -->

# Compare Envs Webpack Plugin

Check whether the contents of dotenv files are consistent.

## INSTALL

```bash
# use npm
$ npm install --dev @dumlj/compare-envs-webpack-plugin
# use yarn
$ yarn add --dev @dumlj/compare-envs-webpack-plugin
# use pnpm
$ pnpm add @dumlj/compare-envs-webpack-plugin -D
```

## USAGE

```ts
import { CompareEnvsWebpackPlugin } from '@dumlj/compare-envs-webpack-plugin'

export default {
  // ...
  plugins: [
    new CompareEnvsWebpackPlugin({
      compare: ['dotenv/*.env'],
    }),
  ],
}
```

## LIVE DEMO

<dumlj-stackblitz height="800px" src="@dumlj-example/compare-envs-webpack-plugin"></dumlj-stackblitz>

## INTERNAL DEPENDENCIES

- [@dumlj/seed-webpack-plugin](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/compare-envs-webpack-plugin)
  - [@dumlj/feature-updater](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/compare-envs-webpack-plugin)
    - [@dumlj/shell-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/compare-envs-webpack-plugin)
    - [@dumlj/util-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/compare-envs-webpack-plugin)
    - [@dumlj/mock-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/compare-envs-webpack-plugin)<sup><small>PRIVATE</small></sup>
  - [@dumlj/mock-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/compare-envs-webpack-plugin)<sup><small>PRIVATE</small></sup>

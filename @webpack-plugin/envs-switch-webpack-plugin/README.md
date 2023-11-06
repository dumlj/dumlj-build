<!-- This file is dynamically generated. please edit in __readme__ -->

# Envs Switch Webpack Plugin

Switch environment variables by generated script.

## INSTALL

```bash
# use npm
$ npm install --dev @dumlj/envs-switch-webpack-plugin
# use yarn
$ yarn add --dev @dumlj/envs-switch-webpack-plugin
# use pnpm
$ pnpm add @dumlj/envs-switch-webpack-plugin -D
```

## USAGE

```bash
$ echo 'process.env.APP_ENV=production' > dotenv/production.env
$ echo 'process.env.APP_ENV=development' > dotenv/development.env
$ echo 'process.env.APP_ENV=default' > .env
```

```ts
import { DynamicEnvsWebpackPlugin } from '@dumlj/dynamic-envs-webpack-plugin'

export default {
  // ...
  plugins: [new EnvsSwitchWebpackPlugin()],
}
```

## LIVE DEMO

<dumlj-stackblitz height="800px" src="@dumlj-example/envs-switch-webpack-plugin"></dumlj-stackblitz>

## INTERNAL DEPENDENCIES

- [@dumlj/seed-webpack-plugin](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/envs-switch-webpack-plugin)
  - [@dumlj/feature-updater](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/envs-switch-webpack-plugin)
    - [@dumlj/shell-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/envs-switch-webpack-plugin)
    - [@dumlj/util-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/envs-switch-webpack-plugin)
    - [@dumlj/mock-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/envs-switch-webpack-plugin)<sup><small>PRIVATE</small></sup>
  - [@dumlj/mock-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/envs-switch-webpack-plugin)<sup><small>PRIVATE</small></sup>
- [@dumlj/compare-envs-webpack-plugin](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/envs-switch-webpack-plugin)<sup><small>PRIVATE</small></sup>
  - [@dumlj/seed-webpack-plugin](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/envs-switch-webpack-plugin)
    - [@dumlj/feature-updater](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/envs-switch-webpack-plugin)
      - [@dumlj/shell-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/envs-switch-webpack-plugin)
      - [@dumlj/util-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/envs-switch-webpack-plugin)
      - [@dumlj/mock-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/envs-switch-webpack-plugin)<sup><small>PRIVATE</small></sup>
    - [@dumlj/mock-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/envs-switch-webpack-plugin)<sup><small>PRIVATE</small></sup>
  - [@dumlj/feature-dotenv](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/envs-switch-webpack-plugin)<sup><small>PRIVATE</small></sup>
- [@dumlj/dynamic-envs-webpack-plugin](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/envs-switch-webpack-plugin)<sup><small>PRIVATE</small></sup>
  - [@dumlj/seed-webpack-plugin](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/envs-switch-webpack-plugin)
    - [@dumlj/feature-updater](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/envs-switch-webpack-plugin)
      - [@dumlj/shell-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/envs-switch-webpack-plugin)
      - [@dumlj/util-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/envs-switch-webpack-plugin)
      - [@dumlj/mock-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/envs-switch-webpack-plugin)<sup><small>PRIVATE</small></sup>
    - [@dumlj/mock-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/envs-switch-webpack-plugin)<sup><small>PRIVATE</small></sup>
  - [@dumlj/util-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/envs-switch-webpack-plugin)

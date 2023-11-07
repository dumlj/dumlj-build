<!-- This file is dynamically generated. please edit in __readme__ -->

# Dynamic Envs Webpack Plugin

Dynamically getting environment variables.

## INSTALL

```bash
# use npm
$ npm install --dev @dumlj/dynamic-envs-webpack-plugin
# use yarn
$ yarn add --dev @dumlj/dynamic-envs-webpack-plugin
# use pnpm
$ pnpm add @dumlj/dynamic-envs-webpack-plugin -D
```

## USAGE

```ts
import { DynamicEnvsWebpackPlugin } from '@dumlj/dynamic-envs-webpack-plugin'

export default {
  // ...
  plugins: [
    new DynamicEnvsWebpackPlugin({
      'process.env.APP_ENV': JSON.stringify('development'),
    }),
  ],
}
```

## LIVE DEMO

<dumlj-stackblitz height="800px" src="@dumlj-example/dynamic-envs-webpack-plugin"></dumlj-stackblitz>

## INTERNAL DEPENDENCIES

<pre>
<b>@dumlj/dynamic-envs-webpack-plugin</b>
└─┬ <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/dynamic-envs-webpack-plugin">@dumlj/seed-webpack-plugin</a>
  ├─┬─ <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/dynamic-envs-webpack-plugin">@dumlj/feature-updater</a>
  │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/dynamic-envs-webpack-plugin">@dumlj/shell-lib</a>
  │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/dynamic-envs-webpack-plugin">@dumlj/util-lib</a>
  │ └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/dynamic-envs-webpack-plugin">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
  └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/dynamic-envs-webpack-plugin">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
</pre>

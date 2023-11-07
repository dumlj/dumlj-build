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

Please pay attention to the console error message.

<dumlj-stackblitz height="47vw" src="@dumlj-example/compare-envs-webpack-plugin"></dumlj-stackblitz>

## INTERNAL DEPENDENCIES

<pre>
<b>@dumlj/compare-envs-webpack-plugin</b>
└─┬ <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/seed-webpack-plugin">@dumlj/seed-webpack-plugin</a>
  ├─┬─ <a href="https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-updater">@dumlj/feature-updater</a>
  │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/shell-lib">@dumlj/shell-lib</a>
  │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib">@dumlj/util-lib</a>
  │ └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
  └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
</pre>

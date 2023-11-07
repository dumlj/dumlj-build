<!-- This file is dynamically generated. please edit in __readme__ -->

# Dts Webpack Plugin

Build dts files with webpack

## BACKGROUND

After Webpack is built, it is no longer the original resource.
Therefore, if you want to export `.d.ts` files, you need to execute `tsc` to compile the `.d.ts` file.

## FEATURE

- It can directly output `d.ts` files.
- Support alias of `tsconfig.json` by default.
  - It was use [ts-patch](https://github.com/nonara/ts-patch) to support alias.

## INSTALL

```bash
# use npm
$ npm install --dev @dumlj/dts-webpack-plugin
# use yarn
$ yarn add --dev @dumlj/dts-webpack-plugin
# use pnpm
$ pnpm add @dumlj/dts-webpack-plugin -D
```

## USAGE

```ts
import { OneWebpackDTSPlugin } from '@series-one/webpack-dts-plugin'

export default {
  plugins: [
    new OneWebpackDTSPlugin({
      rootDir: path.join(__dirname, './src'),
    }),
  ],
}
```

## LIVE DEMO

After execution, please check the `console` or `./build` directory.

<dumlj-stackblitz height="800px" src="@dumlj-example/dts-webpack-plugin"></dumlj-stackblitz>

## INTERNAL DEPENDENCIES

<pre>
<b>@dumlj/dts-webpack-plugin</b>
└─┬ <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/dts-webpack-plugin">@dumlj/seed-webpack-plugin</a>
  ├─┬─ <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/dts-webpack-plugin">@dumlj/feature-updater</a>
  │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/dts-webpack-plugin">@dumlj/shell-lib</a>
  │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/dts-webpack-plugin">@dumlj/util-lib</a>
  │ └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/dts-webpack-plugin">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
  └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/dts-webpack-plugin">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
</pre>

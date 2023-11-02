<!-- This file is dynamically generated. please edit in __readme__ -->

# Zip Webpack Plugin

Compressed to zip webpack plugin

## BACKGROUND

Sometimes we need to push the entire project to a certain system by uploading `zip`, such as `ci/cd`, `Chrome Extension`, etc. So it is most convenient to use a compressed file.

## FEATURE

- Automatically collect emitted files by webpack.
- Trim other files by setting the `onlyZip` option.
- Implemented using [jszip](https://www.npmjs.com/package/jszip).

## INSTALL

```bash
# use npm
$ npm install --dev @dumlj/zip-webpack-plugin
# use yarn
$ yarn add --dev @dumlj/zip-webpack-plugin
# use pnpm
$ pnpm add @dumlj/zip-webpack-plugin -D
```

## USAGE

```ts
import { ZipWebpackPlugin } from '@dumlj/zip-webpack-plugin'

export default {
  plugins: [
    new ZipWebpackPlugin({
      // default false
      lonely: false,
      extras: {
        '/not_import.js': '/do_import.js',
      },
    }),
  ],
}
```

## LIVE DEMO

In the demo, the files is output to the memory, please check the `console`.
Or remove the comment `writeToDisk: true` from the `VitrualWebpackPlugin` in `webpack.config.ts` and run `yarn build`.

<dumlj-stackblitz height="800px" src="@dumlj-example/zip-webpack-plugin"></dumlj-stackblitz>

## INTERNAL DEPENDENCIES

- [@dumlj/seed-webpack-plugin](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/seed-webpack-plugin)
- [@dumlj/mock-lib](https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib)

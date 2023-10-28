<!-- This file is dynamically generated. please edit in __readme__ -->

# Pretty Assets Tree Webpack Plugin

Pretty print assets tree.

## BACKGROUND

When writing DEMO, it need to print files from webpack build in the form of a tree, but Webpack only provides file arrays and cannot output well.

## INSTALL

```bash
# use npm
$ npm install --dev @dumlj/pretty-assets-tree-webpack-plugin
# use yarn
$ yarn add --dev @dumlj/pretty-assets-tree-webpack-plugin
# use pnpm
$ pnpm add @dumlj/pretty-assets-tree-webpack-plugin -D
```

## USAGE

```ts
import { PrettyAssetsTreeWebpackPlugin } from '@dumlj/pretty-assets-tree-webpack-plugin'

export default {
  mode: 'production',
  plugins: [
    new PrettyAssetsTreeWebpackPlugin({
      banner: chalk.whiteBright.bold('The following files are artifacts.'),
      include: ['**/*.d.ts'],
    }),
  ],
}
```

## LIVE DEMO

In the demo, the files is output to the memory, please check the `console`.
Or remove the comment `writeToDisk: true` from the `VitrualWebpackPlugin` in `webpack.config.ts` and run `yarn build`.

<stackblitz-live-demo height="800px" src="@dumlj-example/pretty-assets-tree-webpack-plugin"></stackblitz-live-demo>

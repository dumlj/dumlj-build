<!-- This file is dynamically generated. please edit in __readme__ -->

# Zip Webpack Plugin

Compressed to zip webpack plugin

## BACKGROUND

有时我们需要通过上传 `zip` 将整个项目推送到某系统，例如 `ci/cd`, `Chrome Extension` 等等。

### 原理

通过 [jszip](https://www.npmjs.com/package/jszip) 对 webpack assets 进行压缩，并通过 `emitAssets` 提交资源文件并输出。

## FEATURE

- 开箱即用自动压缩
- 如果只关注压缩文件，可以通过 `onlyZip` 减少 `I/O` 消耗

## INSTALL

```bash
# use npm
$ npm install --dev @dumlj/zip-webpack-plugin
# use yarn
$ yarn add --dev @dumlj/zip-webpack-plugin
# use pnpm
$ pnpm add @dumlj/zip-webpack-plugin -D
```

## LIVE DEMO

In the demo, the files is output to the memory, please check the `console`.
Or remove the comment `writeToDisk: true` from the `VitrualWebpackPlugin` in `webpack.config.ts` and run `yarn build`.

<dumlj-stackblitz height="800px" src="@dumlj-example/zip-webpack-plugin"></dumlj-stackblitz>

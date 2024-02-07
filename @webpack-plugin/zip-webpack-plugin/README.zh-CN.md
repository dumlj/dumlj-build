<!-- This file is dynamically generated. please edit in __readme__ -->

## 背景

有时我们需要通过上传 zip 文件将整个项目推送到某个系统，例如 ci/cd、Chrome Extension 等。因此，使用压缩文件是最方便的。

## 特性

- 自动收集webpack发出的文件。
- 通过设置`onlyZip`选项来修剪其他文件。
- 使用[jszip](https://www.npmjs.com/package/jszip)实现。

## 使用

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

## 在线演示

在演示中，文件输出到内存，请查看`控制台`。
或者从`webpack.config.ts`中的`MemfsWebpackPlugin`中删除注释`writeToDisk: true`并运行`yarn build`。

<dumlj-stackblitz height="47vw" src="@dumlj-example/zip-webpack-plugin"></dumlj-stackblitz>

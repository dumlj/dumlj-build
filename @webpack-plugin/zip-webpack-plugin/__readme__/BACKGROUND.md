## BACKGROUND

有时我们需要通过上传 `zip` 将整个项目推送到某系统，例如 `ci/cd`, `Chrome Extension` 等等。

### 原理

通过 [jszip](https://www.npmjs.com/package/jszip) 对 webpack assets 进行压缩，并通过 `emitAssets` 提交资源文件并输出。

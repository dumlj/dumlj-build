<!-- This file is dynamically generated. please edit in __readme__ -->

# Feature Uploader

corss platform uploader

## BACKGROUND

工具主要为了磨平不同服务商的 SDK 上传接口，用统一方法对接各个云服务商。
暂时支持 `oss`, `s3`

## FEATURE

- 通过单一方法实现上传
  - 支持 OSS
  - 支持 S3

## INSTALL

```bash
# use npm
$ npm install --dev @dumlj/feature-uploader
# use yarn
$ yarn add --dev @dumlj/feature-uploader
# use pnpm
$ pnpm add @dumlj/feature-uploader -D
```

## USAGE

```ts
import { findOutdateds } from '@series-one/toolkit-updater'

const outdates = await findOutdateds({
  /* 仅更新补丁版与功能版本 */
  includes: ['minor', 'patch'],
  /* 发布时间超过(单位毫秒) */
  overTime: 0,
  /* 请求超时, 默认 3 秒 */
  timeout: 3e3,
})

outdates.forEach(({ name, updateType, version, latestVersion }) => {
  console.log(`${name}@${version}有一个新的${updateType}版本,请更新到${latestVersion}`)
})
```

### 单独使用

```ts
import { shouldUpdate } from '@series-one/toolkit-updater'

const {
  name,
  updateType,
  version,
  latestVersion,
  shouldUpdate: needUpdate,
} = await shouldUpdate('name', {
  /* 当前版本 */
  comareVersion: '1.0.0',
  /* 仅更新补丁版与功能版本 */
  includes: ['minor', 'patch'],
  /* 发布时间超过(单位毫秒) */
  overTime: 0,
  /* 请求超时, 默认 3 秒 */
  timeout: 3e3,
})

if (needUpdate) {
  console.log(`${name}@${version}有一个新的${updateType}版本,请更新到${latestVersion}`)
}
```

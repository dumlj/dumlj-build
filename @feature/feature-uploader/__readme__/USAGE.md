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

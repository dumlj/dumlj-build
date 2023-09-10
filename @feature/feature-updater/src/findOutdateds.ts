import semver from 'semver'
import { npmDeclaredParents } from '@dumlj/shell-lib'
import { latest as findLatestVersion, type LatestOptions as FindLatestVersionOptions } from './utils/latest'
import { diff as diffVersion } from './utils/diff'
import { getPackageSource } from './getPackageSource'

export interface FindOutdatedsOptions extends Omit<FindLatestVersionOptions, 'compareVersion'> {
  /** 依赖名 */
  name?: string
  /**
   * 最后的版本号
   * @description
   * 不传默认读取远程
   * 一般仅用于调试
   */
  latestVersion?: string
}

/** 查找过期模块 */
export const findOutdateds = async (options?: FindOutdatedsOptions) => {
  const { name = (await getPackageSource()).name, latestVersion: latest, ...latestVersionOptions } = options || {}

  /** 所有在有声明且引入该库的包名 */
  const dependencies = await npmDeclaredParents(name)
  const updates = await Promise.all(
    dependencies.map(async ({ name, version: compareVer }) => {
      try {
        const version = latest || (await findLatestVersion(name, { ...latestVersionOptions, compareVer }))
        const needUpdate = semver.parse(compareVer).compare(latest) == -1
        const updateType = diffVersion(compareVer, latest)
        return { name, updateType, version: compareVer, latestVersion: version, shouldUpdate: needUpdate }
      } catch (error) {
        // nothing todo...
      }

      return { name, updateType: undefined, version: compareVer, latestVersion: undefined, shouldUpdate: false }
    })
  )

  return updates.filter(({ shouldUpdate = false }) => shouldUpdate)
}

import semver from 'semver'
import { diff as diffVersion } from './utils/diff'
import { latest as findLatestVersion, type LatestOptions as FindLatestVersionOptions } from './utils/latest'

export interface ShouldUpdateOptions extends FindLatestVersionOptions {
  /**
   * 最后的版本号
   * @description
   * 不传默认读取远程
   * 一般仅用于调试
   */
  latestVersion?: string
}

/** 检测包需要更新 */
export const shouldUpdate = async (name: string, options?: ShouldUpdateOptions) => {
  const { compareVer = '0.0.0-alpha.0', latestVersion: inLatestVersion } = options || {}

  /** 最新版本 */
  const latest = inLatestVersion || (await findLatestVersion(name, options))

  /**
   * 应该更新
   * @description
   * 最新版本对比当前版本有更新
   */
  const shouldUpdate = semver.parse(latest).compare(compareVer) > 0

  /** 升级类型 */
  const updateType = diffVersion(compareVer, latest)

  return { name, updateType, version: compareVer, latestVersion: latest, shouldUpdate }
}

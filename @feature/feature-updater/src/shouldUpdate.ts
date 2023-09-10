import semver from 'semver'
import { latest as findLatestVersion, type LatestOptions as FindLatestVersionOptions } from './utils/latest'
import { diff as diffVersion } from './utils/diff'

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
  const latest = inLatestVersion || (await findLatestVersion(name, options))
  const shouldUpdate = semver.parse(compareVer).compare(latest) > 0
  const updateType = diffVersion(compareVer, latest)
  return { name, updateType, version: compareVer, latestVersion: latest, shouldUpdate }
}

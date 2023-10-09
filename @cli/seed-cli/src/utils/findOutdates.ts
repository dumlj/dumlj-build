import { shouldUpdate } from '@dumlj/feature-updater'
import { registerCache } from '@dumlj/util-lib'
import fs from 'fs-extra'
import { readPackageSourceThroughBin } from '../utils/readPackageSourceThroughBin'

export const CACHE_TOKEN = 'outdates'
export const OUTDATES_CACHE = registerCache<{ compareVer: string; updateType: string | boolean; latestVersion: string }>('cli')

export interface FindOutdatesOptions {
  bin?: string
}

/**
 * 更新检查命令
 * @description
 * 因为查找命令需要 1 秒多的时间，
 * 因此我们在 findCommands 中已经具备缓存能力，
 * 但更新缓存的时机只会是变更依赖后。
 * 为了优化这个查找过程所花的时间，专门建立一条刷新的后台进程
 * 对命令列表进行更新，让执行与更新同时执行，相当于异步执行。
 */
export const findOutdates = async (options?: FindOutdatesOptions) => {
  const { bin } = options || { bin: process.argv[1] }
  const realBin = await fs.realpath(bin)
  const source = await readPackageSourceThroughBin(realBin)

  // 正常不会没有，真的没有不处理
  if (!source) {
    return
  }

  const { name, version: compareVer, private: isPrivate = false } = source
  // 是否为内部模块，内部模块代表当前开发项目，无需提示更新
  if (isPrivate) {
    return
  }

  const {
    shouldUpdate: needUpdate,
    updateType,
    latestVersion,
  } = await shouldUpdate(name, {
    compareVer,
    includes: ['minor', 'preminor', 'patch', 'prepatch'],
  })

  const CACHE_NAME = `${CACHE_TOKEN}/${name}`
  if (!needUpdate) {
    await OUTDATES_CACHE.remove(CACHE_NAME)
    return
  }

  await OUTDATES_CACHE.write(CACHE_NAME, { updateType, compareVer, latestVersion })
  return { updateType, compareVer, latestVersion }
}

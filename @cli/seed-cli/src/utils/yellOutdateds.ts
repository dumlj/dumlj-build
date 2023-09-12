import { fail, warn } from '@dumlj/feature-pretty'
import { shouldUpdate } from '@dumlj/feature-updater'
import chalk from 'chalk'
import fs from 'fs-extra'
import { readPackageSourceThroughBin } from './readPackageSourceThroughBin'

interface YellOutdatedsOptions {
  bin?: string
}

/** 版本过期警告 */
export const yellOutdateds = async (options?: YellOutdatedsOptions) => {
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

  try {
    const {
      shouldUpdate: needUpdate,
      updateType,
      latestVersion,
    } = await shouldUpdate(name, {
      compareVer,
      includes: ['minor', 'preminor', 'patch', 'prepatch'],
    })

    if (needUpdate) {
      const badge = `${chalk.bgYellow(' WARN ')}`
      const message = `${chalk.bold(name)}@${chalk.bold(compareVer)} has a new ${chalk.bold(updateType)} version, please update to ${chalk.bold(latestVersion)}.`
      warn(chalk.yellow(`${badge} ${message}`))
    }
  } catch (error) {
    fail(error)
  }
}

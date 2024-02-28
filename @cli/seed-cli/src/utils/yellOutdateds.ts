import { fail, warn } from '@dumlj/feature-pretty'
import { shouldUpdate } from '@dumlj/feature-updater'
import fs from 'fs'
import chalk from 'chalk'
import { readPackageSourceThroughBin } from './readPackageSourceThroughBin'
import { YELL_VERSION_TYPE } from '../constants/definition'

export interface YellOutdatedsOptions {
  bin?: string
}

/** 版本过期警告 */
export const yellOutdateds = async (options?: YellOutdatedsOptions) => {
  const { bin = process.argv[1] } = options || {}
  const realBin = await fs.promises.realpath(bin)
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
      includes: YELL_VERSION_TYPE,
    })

    if (needUpdate) {
      const badge = `${chalk.bgYellow(' WARN ')}`
      const message = `${chalk.bold(name)}@${chalk.bold(compareVer)} has a new ${chalk.bold(updateType)} version, please update to ${chalk.bold(latestVersion)}.`
      warn(chalk.yellow(`${badge} ${message}`))
      return
    }
  } catch (error) {
    if (!(error instanceof Error)) {
      throw error
    }

    // 未发布的不进行对比
    if (/npm ERR! code E404/.test(error?.message)) {
      return
    }

    fail(error)
  }
}

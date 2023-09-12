import { exec } from 'child_process'
import semver from 'semver'
import { diff, type DiffValues } from './diff'

/** 需要删除的无用属性 */
const USELESS_PROPS = ['modified', 'created']

/** 最少请求包超时时间 */
const MIN_TIMEOUT = 0.2e3

/**
 * 缓存，相同务必要重新请求
 * @description
 * 重试必须重启，可以忽略这种情况
 */
const CACHE_LATEST_VERSION = new Map<string, string>()

/** 过去 NPM 发布时间命令 */
const command = (name: string) => `npm show ${name} time --json`

/** 最后版本 */
export interface LatestOptions {
  /** 对比的版本号 */
  includes?: DiffValues[]
  /** 需要对比的版本 */
  compareVer?: string
  /** 设置发布后经过指定时间段后才执行 */
  sincePublish?: number
  /** 超时时间 (单位：毫秒，默认：3秒)  */
  timeout?: number
}

/** 获取最后版本 */
export const latest = async (name: string, options?: LatestOptions) => {
  const { includes = ['major', 'minor', 'patch'], sincePublish = 0, compareVer = '0.0.1-alpha.0', timeout = 3e3 } = options || {}

  // token is used for caching and it is only requested once.
  const CACHE_TOKEN = Buffer.from(`${name}_${includes.join('_')}_${sincePublish}_${compareVer}`).toString('base64')
  const lstVersion = CACHE_LATEST_VERSION.get(CACHE_TOKEN)
  if (lstVersion) {
    return lstVersion
  }

  return new Promise<string>((resolve, reject) => {
    const cp = exec(command(name), (error, stdout) => {
      // 清除超时
      timeId && clearTimeout(timeId)

      if (error) {
        reject(error)
        return
      }

      let response: Record<string, string> = {}
      try {
        response = JSON.parse(stdout)
      } catch (error) {
        reject(new Error(`parse failed\n${stdout}`))
        return
      }

      /** 版本列表 */
      const remoteVers = Object.keys(response)
      /** 过滤后的版本 */
      const filteredVers = remoteVers.filter((version) => {
        // 过滤无用属性
        if (USELESS_PROPS.indexOf(version) !== -1) {
          return false
        }

        if (!includes.includes(diff(compareVer, version))) {
          return false
        }

        // 保证必须是在当前版本之后发布
        if (![0, -1].includes(semver.parse(compareVer).compare(version))) {
          return false
        }

        // 确保在发布后一段时间执行它
        const delta = Date.now() - new Date(response[version]).getTime()
        if (0 < delta && delta < sincePublish) {
          return false
        }

        return true
      })

      /** 按日期排序版本列表 */
      const sortedVers = filteredVers.sort((prev, next) => new Date(response[next]).getTime() - new Date(response[prev]).getTime())
      /** 最终版本号 */
      const finalVersion = sortedVers?.[0] || compareVer

      // 缓存
      CACHE_LATEST_VERSION[CACHE_TOKEN] = finalVersion
      resolve(finalVersion)
    })

    const kill = (reason: string) => {
      reject(new Error(reason))
      cp.kill()
    }

    const finalTimeout = timeout >= MIN_TIMEOUT ? timeout : MIN_TIMEOUT
    const timeId = setTimeout(
      () => kill(`npm connect timeout, please enter \`npm ping\` and \`npm show ${name} time --json\` and check if network can connect npm registry.`),
      finalTimeout
    )
  })
}

import chalk, { type Color } from 'chalk'
import { pretty } from './pretty'
import type { Options } from './types'

/** 是否展示详情 */
const isVerbose = -1 !== process.argv.indexOf('--verbose') ? true : process.env.RUNTIME === 'CLI' ? false : true

/** 注册着色函数配置 */
export interface RegisterPrettyOptions {
  /** 只展示在"展示详情"的情况下 */
  onlyShowInVerbose?: boolean
  /** 前缀信息 */
  prefix?: string
  /** 展示详情 */
  verbose?: boolean
}

/** 注册着色函数 */
export const registerPretty = (color: typeof Color, registerOptions?: RegisterPrettyOptions) => (info: string | Error, options?: Options) => {
  const { prefix, onlyShowInVerbose = false, verbose: inVerbose = false } = registerOptions || {}
  const { verbose = isVerbose || inVerbose, ...restOptions } = options || {}
  const { message, reason, prettyMessage } = pretty(info, { ...restOptions, verbose })
  const content = prefix ? `${prefix} ${message}` : message

  const logs = typeof chalk[color] === 'function' ? chalk[color](content) : content
  if (!(onlyShowInVerbose && !verbose)) {
    // eslint-disable-next-line no-console
    console.log(logs)
  }

  return { message, reason, prettyMessage }
}

import PrettyError from 'pretty-error'
import type { Options } from './types'

/** 基础着色函数 */
export const pretty = (info: string | Error, options?: Options) => {
  const { prefix, verbose } = options || {}
  const reason = info instanceof Error ? info : new Error(info)
  const pe = new PrettyError()
  const prettyMessage = pe.render(reason)
  const message = `${reason.message}${verbose === true ? `\n${prettyMessage}` : ''}`
  return { message: prefix ? `${prefix} ${message}` : message, reason, prettyMessage }
}

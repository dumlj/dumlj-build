import { debug, fail, info, success, warn } from './logger'
import type { Options } from './types'

/**
 * 创建新的 Pretty 实例
 * @description
 * 主要用于前置名称
 */
export const createPretty = (name: string) => {
  const methods = { debug, success, info, warn, fail }

  type TrimPrefixOption<T extends Record<string, (...args: any[]) => any>> = {
    [K in keyof T]: (message: string | Error, options?: Omit<Options, 'prefix'>) => ReturnType<T[K]>
  }

  return Object.keys(methods).reduce((result, method) => {
    result[name] = (message: string | Error, options: Options = {}) => {
      return methods[method](message, { ...options, prefix: name })
    }

    return result
  }, {} as TrimPrefixOption<typeof methods>)
}

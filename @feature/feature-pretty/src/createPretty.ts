import { debug, fail, info, ok, warn } from './logger'
import type { Options } from './types'

/**
 * 创建新的 Pretty 实例
 * @description
 * 主要用于前置名称
 */
export const createPretty = (name: string) => {
  const methods = { debug, ok, info, warn, fail }

  type TrimPrefixOption<T extends Record<string, (...args: any[]) => any>> = {
    [K in keyof T]: (message: string | Error, options?: Omit<Options, 'prefix'>) => ReturnType<T[K]>
  }

  type Method = keyof typeof methods
  const VERBOSE_METHODS: Method[] = ['fail']

  return Object.keys(methods).reduce(
    (result, method: Method) => {
      result[method] = (message: string | Error, options: Options = {}) => {
        const verbose = VERBOSE_METHODS.includes(method)
        return methods[method](message, { verbose, ...options, prefix: name })
      }

      return result
    },
    {} as TrimPrefixOption<typeof methods>
  )
}

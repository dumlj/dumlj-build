import { debug, fail, info, ok, warn } from './logger'
import type { Options } from './types'

/**
 * 创建新的 Pretty 实例
 * @description
 * 主要用于前置名称
 */
export function createPretty(name: string) {
  const methods = { debug, ok, info, warn, fail } as const

  type MessageHandler<T> = (message: string | Error, options?: Omit<Options, 'prefix'>) => T
  type TrimPrefixOption<T extends Record<string, (...args: any[]) => any>> = {
    [K in keyof T]: MessageHandler<ReturnType<T[K]>>
  }

  type Method = keyof typeof methods
  const VERBOSE_METHODS: Method[] = ['fail']

  return <TrimPrefixOption<typeof methods>>Object.fromEntries(
    (function* () {
      for (const method of Object.keys(methods) as Method[]) {
        yield [
          method,
          (message: string | Error, options: Options = {}) => {
            const verbose = VERBOSE_METHODS.includes(method)
            const fn = methods[method]
            return fn(message, { verbose, ...options, prefix: name })
          },
        ]
      }
    })()
  )
}

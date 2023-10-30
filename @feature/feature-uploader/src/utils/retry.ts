import { sleep } from './sleep'

/** 重试配置 */
export interface RetryOptions {
  /** 重试次数 */
  retryTimes?: number
  /** 重试提醒 */
  onRetry?: (error: Error, options?: { times: number }) => void
  /**
   * 重试延迟进行（单位：毫秒）
   * @description
   * 错误重试，延迟 N 毫秒再重新尝试
   * 默认延迟 1 秒
   */
  retryDelay?: number
}

/** 重试 */
export const retry = <T extends (...args: any[]) => Promise<any>>(fn: T, options?: RetryOptions) => {
  const { retryTimes = 3, onRetry, retryDelay = 1e3 } = options || {}
  return (...args: Parameters<T>): ReturnType<T> => {
    const maxRetryTimes = typeof retryTimes === 'number' && Number.isSafeInteger(retryTimes) && retryTimes > 0 ? retryTimes : 3
    const reExceute = async (times = 0) => {
      return fn(...args).catch(async (error) => {
        if (times < maxRetryTimes) {
          if (typeof onRetry === 'function') {
            try {
              onRetry(error, { times })
            } catch (error) {
              // nothing todo...
            }
          }

          // 一秒后重新尝试
          await sleep(retryDelay)
          return reExceute(times + 1)
        }

        return Promise.reject(error)
      })
    }

    return reExceute()
  }
}

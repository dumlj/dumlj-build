import { retry } from '@/utils/retry'

describe('test utils/retry', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.spyOn(global, 'setTimeout')
  })

  it('can re-exceute function when an error occurs', async () => {
    const handle = jest.fn(() => Promise.reject(new Error('some error')))
    const { rejects: handleRejects } = expect(
      retry(handle, {
        /**
         * The first time is the current execution,
         * and the retries failed 3 times,
         * a total of 4 times.
         */
        retryTimes: 3,
        onRetry: async () => {
          await Promise.resolve()
          /**
           * setTimeout is executed after onRetry in the catch callback,
           * so it must be called after Promise.resolve.
           */
          jest.runAllTimers()
        },
      })
    )

    await handleRejects.toThrow('some error')
    expect(handle).toHaveBeenCalledTimes(3 + 1)
  })
})

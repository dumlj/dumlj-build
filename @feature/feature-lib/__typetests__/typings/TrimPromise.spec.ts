import type { TrimPromise } from '@/typings/TrimPromise'
import { expectType } from 'tsd-lite'

describe('test typings/TrimPromise', () => {
  it('trim promise', async () => {
    expectType<TrimPromise<Promise<string>>>(await Promise.resolve<string>(''))
    expectType<TrimPromise<Promise<number>>>(await Promise.resolve<number>(1))
    expectType<TrimPromise<Promise<boolean>>>(await Promise.resolve<boolean>(true))
    expectType<TrimPromise<Promise<() => void>>>(
      await Promise.resolve<() => void>(() => {
        /** nothing */
      })
    )
  })
})

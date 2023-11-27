import { sleep } from '@/utils/sleep'

describe('test utils/sleep', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.spyOn(global, 'setTimeout')
  })

  it('is a function of promisify setTimeout', async () => {
    const after = jest.fn()
    const handle = async () => {
      await sleep(1e3)
      after()
      return 1
    }

    const handleResolves = expect(handle()).resolves
    jest.runAllTimers()
    await handleResolves.toEqual(1)
    expect(after).toBeCalled()
  })
})

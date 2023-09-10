import { getPackageSource } from '@/getPackageSource'

const readJson = jest.fn(async () => ({ name: 'dumlj' }))

jest.mock('fs-extra', () => {
  return {
    readJson: (_: string) => readJson(),
  }
})

describe('test getPackageSource', () => {
  it('can get self pacakge.json', async () => {
    const source = await getPackageSource()
    expect(source.name).toBe('dumlj')
    expect(readJson).toBeCalled()

    // 只执行一次，二次为缓存
    const cache = await getPackageSource()
    expect(cache.name).toBe('dumlj')
    expect(readJson).toBeCalledTimes(1)
  })
})

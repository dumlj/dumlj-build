import { getPackageSource } from '@/getPackageSource'

jest.mock('fs-extra', () => {
  const SOURCE = {
    name: 'dumlj',
    version: '0.0.1',
  }

  const readJson = jest.fn(async () => SOURCE)
  return { readJson }
})

describe('test getPackageSource', () => {
  it('can get self pacakge.json', async () => {
    const source = await getPackageSource()
    expect(source.name).toBe('dumlj')

    // 只执行一次，二次为缓存
    const cache = await getPackageSource()
    expect(cache.name).toBe('dumlj')

    const fs = await import('fs-extra')
    expect(fs.readJson).toHaveBeenCalledTimes(1)
  })
})

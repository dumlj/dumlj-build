import { latest } from '@/utils/latest'

const gTime = (time: number) => {
  const d = new Date()
  d.setSeconds(time)
  return d
}

const VERSIONS = {
  created: gTime(1000),
  modified: gTime(2001),
  '1.0.0': gTime(1000),
  '1.0.1-alpha.1': gTime(1010),
  '1.0.1': gTime(1011),
  '1.1.0-alpha.1': gTime(1010),
  '1.1.0': gTime(1101),
  '1.1.1-alpha.1': gTime(1110),
  '1.1.1': gTime(1111),
  '1.2.0-alpha.1': gTime(1200),
  '1.2.0': gTime(1201),
  '2.0.0-alpha.1': gTime(2000),
  '2.0.0': gTime(2001),
}

jest.mock('child_process', () => {
  return {
    __esModule: true,
    exec(_: string, fn: (error: Error, stdout: string) => void) {
      const fetch = () => fn(null, JSON.stringify(VERSIONS, null, 2))
      Promise.resolve().then(fetch)

      return {
        kill: jest.fn(),
      }
    },
  }
})

describe('test utils/latest', () => {
  let dateNowSpy: jest.SpyInstance<number, []>
  beforeAll(() => {
    const now = gTime(5000).getTime()
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => now)
  })

  afterAll(() => {
    jest.clearAllMocks()
    dateNowSpy.mockRestore()
  })

  it('can get prepatch version', async () => {
    expect(await latest('x', { includes: ['prepatch'], compareVer: '1.0.0' })).toEqual('1.0.1-alpha.1')
    expect(await latest('x', { includes: ['prepatch'], compareVer: '1.1.0' })).toEqual('1.1.1-alpha.1')
    expect(await latest('x', { includes: ['prepatch'], compareVer: '1.1.1-alpha.1' })).toEqual('1.1.1-alpha.1')
  })

  it('can get patch version', async () => {
    expect(await latest('x', { includes: ['patch'], compareVer: '1.0.0' })).toEqual('1.0.1')
    expect(await latest('x', { includes: ['patch'], compareVer: '1.1.0' })).toEqual('1.1.1')

    expect(await latest('x', { includes: ['patch', 'prepatch'], compareVer: '1.0.0' })).toEqual('1.0.1')
  })

  it('can get preminor version', async () => {
    expect(await latest('x', { includes: ['preminor'], compareVer: '1.0.0' })).toEqual('1.1.0-alpha.1')
    expect(await latest('x', { includes: ['preminor'], compareVer: '1.1.0' })).toEqual('1.2.0-alpha.1')
    expect(await latest('x', { includes: ['preminor'], compareVer: '1.2.0-alpha.1' })).toEqual('1.2.0-alpha.1')

    expect(await latest('x', { includes: ['preminor', 'patch'], compareVer: '1.0.0' })).toEqual('1.1.0-alpha.1')
  })

  it('can get minor version', async () => {
    expect(await latest('x', { includes: ['minor'], compareVer: '1.0.0' })).toEqual('1.1.0')
    expect(await latest('x', { includes: ['minor'], compareVer: '1.1.0' })).toEqual('1.2.0')
    expect(await latest('x', { includes: ['minor'], compareVer: '1.2.0' })).toEqual('1.2.0')

    expect(await latest('x', { includes: ['minor', 'preminor'], compareVer: '1.0.0' })).toEqual('1.1.0')
  })

  it('can get premajor version', async () => {
    expect(await latest('x', { includes: ['premajor'], compareVer: '1.0.0' })).toEqual('2.0.0-alpha.1')
    expect(await latest('x', { includes: ['premajor'], compareVer: '1.1.0' })).toEqual('2.0.0-alpha.1')
    expect(await latest('x', { includes: ['premajor'], compareVer: '1.2.0' })).toEqual('2.0.0-alpha.1')
    expect(await latest('x', { includes: ['premajor'], compareVer: '2.0.0-alpha.1' })).toEqual('2.0.0-alpha.1')

    expect(await latest('x', { includes: ['premajor', 'prepatch'], compareVer: '1.0.0' })).toEqual('2.0.0-alpha.1')
  })

  it('can get major version', async () => {
    expect(await latest('x', { includes: ['major'], compareVer: '1.0.0' })).toEqual('2.0.0')
    expect(await latest('x', { includes: ['major'], compareVer: '1.1.0' })).toEqual('2.0.0')
    expect(await latest('x', { includes: ['major'], compareVer: '1.2.0' })).toEqual('2.0.0')
    expect(await latest('x', { includes: ['major'], compareVer: '2.0.0' })).toEqual('2.0.0')

    expect(await latest('x', { includes: ['major', 'patch'], compareVer: '1.0.0' })).toEqual('2.0.0')
  })

  it('can get version after the specified time', async () => {
    expect(await latest('x', { includes: ['major'], compareVer: '1.0.0', sincePublish: 3000 * 1e3 })).toEqual('1.0.0')
    expect(await latest('x', { includes: ['major'], compareVer: '1.0.0', sincePublish: 2000 * 1e3 })).toEqual('2.0.0')
  })
})

import { latest } from '@/utils/latest'
import { gTime } from '../__mocks__/gTime'

jest.mock('child_process', () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const { VERSIONS } = jest.requireActual<typeof import('../__mocks__/constants')>('../__mocks__/constants')
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const { mockLatest } = jest.requireActual<typeof import('@dumlj/mock-lib')>('@dumlj/mock-lib/src')
  const exec = (command: string, fn: (error: Error | null, stdout: string) => void) => {
    if (0 === command.indexOf('npm show')) {
      return mockLatest(VERSIONS)(command, fn)
    }
  }

  return { exec }
})

describe('test utils/latest', () => {
  let dateNowSpy: jest.SpyInstance<number, []>
  beforeAll(() => {
    const now = gTime(5000).getTime()
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => now)
  })

  afterAll(() => {
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
    expect(await latest('x', { includes: ['preminor'], compareVer: '1.0.0' })).toEqual('1.2.0-alpha.1')
    expect(await latest('x', { includes: ['preminor'], compareVer: '1.1.0' })).toEqual('1.2.0-alpha.1')
    expect(await latest('x', { includes: ['preminor'], compareVer: '1.2.0-alpha.1' })).toEqual('1.2.0-alpha.1')

    expect(await latest('x', { includes: ['preminor', 'patch'], compareVer: '1.0.0' })).toEqual('1.2.0-alpha.1')
  })

  it('can get minor version', async () => {
    expect(await latest('x', { includes: ['minor'], compareVer: '1.0.0' })).toEqual('1.2.0')
    expect(await latest('x', { includes: ['minor'], compareVer: '1.1.0' })).toEqual('1.2.0')
    expect(await latest('x', { includes: ['minor'], compareVer: '1.2.0' })).toEqual('1.2.0')

    expect(await latest('x', { includes: ['minor', 'preminor'], compareVer: '1.0.0' })).toEqual('1.2.0')
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

  it('support multiple includes', async () => {
    expect(await latest('x', { includes: ['minor', 'preminor', 'patch', 'prepatch'], compareVer: '1.0.0' })).toEqual('1.2.0')
  })
})

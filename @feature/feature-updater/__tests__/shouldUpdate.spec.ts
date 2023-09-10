import { shouldUpdate } from '@/shouldUpdate'
import { mockLatest } from '@dumlj/mock-lib/src'

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
    exec(command: string, fn: (error: Error, stdout: string) => void) {
      if (0 === command.indexOf('npm show')) {
        return mockLatest(VERSIONS)(command, fn)
      }
    },
  }
})

describe('test shouldUpdate', () => {
  let dateNowSpy: jest.SpyInstance<number, []>
  beforeAll(() => {
    const now = gTime(5000).getTime()
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => now)
  })

  afterAll(() => {
    dateNowSpy.mockRestore()
  })

  it('can detect if a package needs to be upgraded', async () => {
    const { name, version, latestVersion, updateType, shouldUpdate: needUpdate } = await shouldUpdate('name', { compareVer: '1.0.0', includes: ['prepatch'] })
    expect(name).toBe('name')
    expect(version).toBe('1.0.0')
    expect(latestVersion).toBe('1.0.1-alpha.1')
    expect(updateType).toBe('prepatch')
    expect(needUpdate).toBe(true)
  })
})

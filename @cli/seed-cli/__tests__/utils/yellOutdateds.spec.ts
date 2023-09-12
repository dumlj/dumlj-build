import { fs, vol } from 'memfs'
import chalk from 'chalk'
import { yellOutdateds } from '@/utils/yellOutdateds'
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

jest.mock('fs', () => fs)

describe('test utils/yellOutdateds', () => {
  beforeEach(() => {
    chalk.level = 0
  })

  afterEach(() => {
    chalk.level = 3
    vol.reset()
  })

  it('will notify some warnings when cli outdates.', async () => {
    vol.fromJSON({
      '/package.json': JSON.stringify({ name: 'root', version: '1.0.0' }),
      '/bin': 'echo "ok"',
    })

    let result: string
    jest.spyOn(console, 'log').mockImplementationOnce((message) => {
      result = message
    })

    await yellOutdateds({ bin: '/bin' })
    expect(result.search('minor version, please update to 1.2.0')).not.toEqual(-1)
  })
})

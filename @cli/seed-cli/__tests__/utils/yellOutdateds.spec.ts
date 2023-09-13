import { yellOutdateds } from '@/utils/yellOutdateds'
import chalk from 'chalk'
import { vol } from 'memfs'

jest.mock('child_process', () => {
  const { VERSIONS } = jest.requireActual<typeof import('../__mocks__/constants')>('../__mocks__/constants')
  const { mockLatest } = jest.requireActual<typeof import('@dumlj/mock-lib')>('@dumlj/mock-lib/src')
  const exec = (command: string, fn: (error: Error, stdout: string) => void) => {
    if (0 === command.indexOf('npm show')) {
      return mockLatest(VERSIONS)(command, fn)
    }
  }

  return { exec }
})

jest.mock('fs', () => {
  const { fs } = jest.requireActual('memfs')
  return fs
})

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

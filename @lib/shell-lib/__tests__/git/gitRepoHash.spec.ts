import { gitRepoHash } from '@/git/gitRepoHash'
import crypto from 'crypto'

jest.mock('child_process', () => {
  const COMMAND_RESPONSE_MAP = {
    'git remote -v': ['origin  https://github.com/dumlj/dumlj.git (fetch)', 'origin  https://github.com/dumlj/dumlj.git (push)'].join('\n'),
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib')>('@dumlj/mock-lib/src')
  return mockExec(COMMAND_RESPONSE_MAP)
})

describe('test git/gitRepoHash', () => {
  it('can find all contributors', async () => {
    const result = crypto.createHash('md5').update('https://github.com/dumlj/dumlj.git').digest('hex').substring(0, 6)
    expect(await gitRepoHash()).toBe(result)
    expect(gitRepoHash.sync()).toBe(result)
  })
})

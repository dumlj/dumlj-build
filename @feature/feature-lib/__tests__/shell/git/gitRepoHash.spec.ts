import { gitRepoHash } from '@/shell/git/gitRepoHash'
import { mockExec } from '@dumlj/feature-mock/src'
import crypto from 'crypto'

const COMMAND_RESPONSE_MAP = {
  'git remote -v': ['origin  https://github.com/dumlj/dumlj.git (fetch)', 'origin  https://github.com/dumlj/dumlj.git (push)'].join('\n'),
}

const { exec, execSync } = mockExec(COMMAND_RESPONSE_MAP)

jest.mock('child_process', () => ({
  __esModule: true,
  exec: (command: string) => exec(command),
  execSync: (command: string) => execSync(command),
}))

describe('test git/gitRepoHash', () => {
  it('can find all contributors', async () => {
    const result = crypto.createHash('md5').update('https://github.com/dumlj/dumlj.git').digest('hex').substring(0, 6)
    expect(await gitRepoHash()).toBe(result)
    expect(gitRepoHash.sync()).toBe(result)
  })
})

import { gitRepoUrl } from '@/shell/git/gitRepoUrl'
import { mockExec } from '@dumlj/feature-mock/src'

const COMMAND_RESPONSE_MAP = {
  'git remote -v': ['origin  https://github.com/dumlj/dumlj.git (fetch)', 'origin  https://github.com/dumlj/dumlj.git (push)'].join('\n'),
}

const { exec, execSync } = mockExec(COMMAND_RESPONSE_MAP)

jest.mock('child_process', () => ({
  __esModule: true,
  exec: (command: string) => exec(command),
  execSync: (command: string) => execSync(command),
}))

describe('test git/gitRepoUrl', () => {
  it('can get repo url', async () => {
    expect(await gitRepoUrl()).toBe('https://github.com/dumlj/dumlj.git')
    expect(gitRepoUrl.sync()).toBe('https://github.com/dumlj/dumlj.git')
  })
})

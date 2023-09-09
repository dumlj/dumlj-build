import { gitCommitHash } from '@/shell/git/gitCommitHash'
import { mockExec } from '@dumlj/feature-mock/src'

const COMMAND_RESPONSE_MAP = {
  'git rev-parse --short HEAD': `ok`,
}

const { exec, execSync } = mockExec(COMMAND_RESPONSE_MAP)

jest.mock('child_process', () => ({
  __esModule: true,
  exec: (command: string) => exec(command),
  execSync: (command: string) => execSync(command),
}))

describe('test git/gitChangedFiles', () => {
  it('can clone git repository', async () => {
    expect(await gitCommitHash()).toBe('ok')
    expect(gitCommitHash.sync()).toBe('ok')
  })
})

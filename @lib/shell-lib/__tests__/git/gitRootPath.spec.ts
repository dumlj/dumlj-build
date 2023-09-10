import { gitRootPath } from '@/git/gitRootPath'
import { mockExec } from '@dumlj/mock-lib/src'

const COMMAND_RESPONSE_MAP = {
  'git rev-parse --show-toplevel': '/path/to/dumlj',
}

const { exec, execSync } = mockExec(COMMAND_RESPONSE_MAP)

jest.mock('child_process', () => ({
  __esModule: true,
  exec: (command: string) => exec(command),
  execSync: (command: string) => execSync(command),
}))

describe('test git/gitRootPath', () => {
  it('can get git root path', async () => {
    expect(await gitRootPath()).toBe('/path/to/dumlj')
    expect(gitRootPath.sync()).toBe('/path/to/dumlj')
  })
})

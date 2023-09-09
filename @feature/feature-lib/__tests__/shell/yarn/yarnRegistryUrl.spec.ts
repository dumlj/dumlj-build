import { yarnRegistryUrl } from '@/shell/yarn/yarnRegistryUrl'
import { mockExec } from '@dumlj/feature-mock/src'

const COMMAND_RESPONSE_MAP = {
  'yarn config get registry': 'https://registry.yarnpkg.com',
}

const { exec, execSync } = mockExec(COMMAND_RESPONSE_MAP)

jest.mock('child_process', () => ({
  __esModule: true,
  exec: (command: string) => exec(command),
  execSync: (command: string) => execSync(command),
}))

describe('test git/gitRootPath', () => {
  it('can get yarn regsitry url', async () => {
    expect(await yarnRegistryUrl()).toBe('https://registry.yarnpkg.com')
    expect(yarnRegistryUrl.sync()).toBe('https://registry.yarnpkg.com')
  })
})

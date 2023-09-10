import { gitClone } from '@/git/gitClone'
import { mockExec } from '@dumlj/mock-lib/src'

const COMMAND_RESPONSE_MAP = {
  'git clone a b': `ok`,
}

const { exec, execSync } = mockExec(COMMAND_RESPONSE_MAP)

jest.mock('child_process', () => ({
  __esModule: true,
  exec: (command: string) => exec(command),
  execSync: (command: string) => execSync(command),
}))

describe('test git/gitChangedFiles', () => {
  it('can clone git repository', async () => {
    expect(await gitClone({ url: 'a', dist: 'b' })).toBe('ok')
    expect(gitClone.sync({ url: 'a', dist: 'b' })).toBe('ok')
  })
})

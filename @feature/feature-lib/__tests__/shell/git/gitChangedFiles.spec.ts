import { gitChangedFiles } from '@/shell/git/gitChangedFiles'
import { mockExec } from '@dumlj/feature-mock/src'

const COMMAND_RESPONSE_MAP = {
  'git status -s': `
    ?? index.ts
  `,
}

const { exec, execSync } = mockExec(COMMAND_RESPONSE_MAP)

jest.mock('child_process', () => ({
  __esModule: true,
  exec: (command: string) => exec(command),
  execSync: (command: string) => execSync(command),
}))

describe('test git/gitChangedFiles', () => {
  it('can find changed files since HEAD', async () => {
    expect(await gitChangedFiles()).toStrictEqual(['index.ts'])
    expect(gitChangedFiles.sync()).toStrictEqual(['index.ts'])
  })
})

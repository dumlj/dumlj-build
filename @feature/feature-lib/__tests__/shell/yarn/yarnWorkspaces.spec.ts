import { yarnWorkspaces } from '@/shell/yarn/yarnWorkspaces'
import { mockExec } from '@dumlj/feature-mock/src'

const WORKSPACES = {
  '@dumlj/feature-lib': {
    location: '@feature/lib',
    workspaceDependencies: [],
    mismatchedWorkspaceDependencies: [],
  },
}

const COMMAND_RESPONSE_MAP = {
  'yarn --json workspaces info': `{
    "type": "log",
    "data": ${JSON.stringify(JSON.stringify(WORKSPACES, null, 2))}
  }`,
}

const { exec, execSync } = mockExec(COMMAND_RESPONSE_MAP)

jest.mock('child_process', () => ({
  __esModule: true,
  exec: (command: string) => exec(command),
  execSync: (command: string) => execSync(command),
}))

describe('test git/gitRootPath', () => {
  it('can get yarn regsitry url', async () => {
    const result = Object.keys(WORKSPACES).map((name) => ({ ...WORKSPACES[name], name }))
    expect(await yarnWorkspaces()).toStrictEqual(result)
    expect(yarnWorkspaces.sync()).toStrictEqual(result)
  })
})

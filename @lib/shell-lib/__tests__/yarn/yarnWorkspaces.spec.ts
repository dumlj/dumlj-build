import { yarnWorkspaces } from '@/yarn/yarnWorkspaces'
import { WORKSPACES } from './__mocks__/constants'

jest.mock('child_process', () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const { WORKSPACES } = jest.requireActual<typeof import('./__mocks__/constants')>('./__mocks__/constants')
  const COMMAND_RESPONSE_MAP = {
    'yarn --json workspaces info': `{
      "type": "log",
      "data": ${JSON.stringify(JSON.stringify(WORKSPACES, null, 2))}
    }`,
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib/src')>('@dumlj/mock-lib/src')
  return mockExec(COMMAND_RESPONSE_MAP)
})

describe('test yarn/yarnWorkspaces', () => {
  it('can get yarn regsitry url', async () => {
    const result = Object.keys(WORKSPACES).map((name) => ({ ...WORKSPACES[name], name }))
    expect(await yarnWorkspaces()).toStrictEqual(result)
    expect(yarnWorkspaces.sync()).toStrictEqual(result)
  })
})
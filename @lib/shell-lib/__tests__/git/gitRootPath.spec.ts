import { gitRootPath } from '@/git/gitRootPath'

jest.mock('child_process', () => {
  const COMMAND_RESPONSE_MAP = {
    'git rev-parse --show-toplevel': '/path/to/dumlj',
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib')>('@dumlj/mock-lib/src')
  return mockExec(COMMAND_RESPONSE_MAP)
})

describe('test git/gitRootPath', () => {
  it('can get git root path', async () => {
    expect(await gitRootPath()).toBe('/path/to/dumlj')
    expect(gitRootPath.sync()).toBe('/path/to/dumlj')
  })
})

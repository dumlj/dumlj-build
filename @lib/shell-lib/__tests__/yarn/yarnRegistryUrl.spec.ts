import { yarnRegistryUrl } from '@/yarn/yarnRegistryUrl'

jest.mock('child_process', () => {
  const COMMAND_RESPONSE_MAP = {
    'yarn config get registry': 'https://registry.yarnpkg.com',
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib/src')>('@dumlj/mock-lib/src')
  return mockExec(COMMAND_RESPONSE_MAP)
})

describe('test yarn/yarnRegistryUrl', () => {
  it('can get yarn regsitry url', async () => {
    expect(await yarnRegistryUrl()).toBe('https://registry.yarnpkg.com')
    expect(yarnRegistryUrl.sync()).toBe('https://registry.yarnpkg.com')
  })
})

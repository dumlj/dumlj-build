import { execute, executeSync } from '@/helpers/execute'

jest.mock('child_process', () => {
  const COMMAND_RESPONSE_MAP = {
    test: 'ok',
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib/src')>('@dumlj/mock-lib/src')
  return mockExec(COMMAND_RESPONSE_MAP)
})

describe('test helper/execute', () => {
  it('can execute shell', async () => {
    expect(await execute('test')).toEqual('ok')
    expect(executeSync('test')).toEqual('ok')
  })
})

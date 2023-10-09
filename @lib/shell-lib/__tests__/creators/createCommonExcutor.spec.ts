import { createCommonExcutor } from '@/creators/createCommonExcutor'

jest.mock('child_process', () => {
  const COMMAND_RESPONSE_MAP = {
    test: 'ok',
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib/src')>('@dumlj/mock-lib/src')
  return mockExec(COMMAND_RESPONSE_MAP)
})

describe('test services/createCommonExcutor', () => {
  it('can create command function', async () => {
    const execute = createCommonExcutor(() => 'test')
    expect(typeof execute).toBe('function')
    expect(typeof execute.sync).toBe('function')

    expect(await execute()).toBe('ok')
    expect(execute.sync()).toBe('ok')
  })
})

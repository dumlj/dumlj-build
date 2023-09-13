import { createCommonExcutor } from '@/creators/createCommonExcutor'

jest.mock('child_process', () => {
  const COMMAND_RESPONSE_MAP = {
    test: 'ok',
  }

  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib')>('@dumlj/mock-lib/src')
  return mockExec(COMMAND_RESPONSE_MAP)
})

describe('test services/createCommonExcutor', () => {
  it('can create command function', async () => {
    const excute = createCommonExcutor(() => 'test')
    expect(typeof excute).toBe('function')
    expect(typeof excute.sync).toBe('function')

    expect(await excute()).toBe('ok')
    expect(excute.sync()).toBe('ok')
  })
})

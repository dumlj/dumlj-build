import { createExecutor } from '@/creators/createExecutor'

jest.mock('child_process', () => {
  const COMMAND_RESPONSE_MAP = {
    test: 'ok',
    'test id': 'ok',
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib/src')>('@dumlj/mock-lib/src')
  return mockExec(COMMAND_RESPONSE_MAP)
})

describe('test services/createExecutor', () => {
  it('can create executor', async () => {
    const create = createExecutor((execute) => execute())
    expect(typeof create).toBe('function')

    const command = create(() => 'test')
    expect(typeof command).toBe('function')

    expect(await command()).toBe('ok')
    expect(command.sync()).toBe('ok')
  })

  it('can pass params to command function', async () => {
    const create = createExecutor((execute) => execute())
    const command = jest.fn((id: string) => `test ${id}`)
    expect(await create(command)('id')).toBe('ok')
    expect(command).toHaveBeenCalled()
  })

  it('can preprocess before executing the command', async () => {
    const preprocess = jest.fn()
    await createExecutor((execute) => preprocess() || execute())(() => 'test')()
    expect(preprocess).toHaveBeenCalled()
    expect(preprocess).toBeCalledTimes(1)
  })

  it('It can process the returned result data', async () => {
    const resolve = jest.fn((stdout: string) => `${stdout} yet`)
    expect(await createExecutor((execute) => execute())(() => 'test', resolve)()).toBe('ok yet')
    expect(resolve).toHaveBeenCalled()
    expect(resolve).toBeCalledTimes(1)
  })
})

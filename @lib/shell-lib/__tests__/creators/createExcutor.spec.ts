import { createExcutor } from '@/creators/createExcutor'

jest.mock('child_process', () => {
  const COMMAND_RESPONSE_MAP = {
    test: 'ok',
    'test id': 'ok',
  }

  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib')>('@dumlj/mock-lib/src')
  return mockExec(COMMAND_RESPONSE_MAP)
})

describe('test services/createExcutor', () => {
  it('can create excutor', async () => {
    const create = createExcutor((excute) => excute())
    expect(typeof create).toBe('function')

    const command = create(() => 'test')
    expect(typeof command).toBe('function')

    expect(await command()).toBe('ok')
    expect(command.sync()).toBe('ok')
  })

  it('can pass params to command function', async () => {
    const create = createExcutor((excute) => excute())
    const command = jest.fn((id: string) => `test ${id}`)
    expect(await create(command)('id')).toBe('ok')
    expect(command).toHaveBeenCalled()
  })

  it('can preprocess before executing the command', async () => {
    const preprocess = jest.fn()
    await createExcutor((excute) => preprocess() || excute())(() => 'test')()
    expect(preprocess).toHaveBeenCalled()
    expect(preprocess).toBeCalledTimes(1)
  })

  it('It can process the returned result data', async () => {
    const resolve = jest.fn((stdout: string) => `${stdout} yet`)
    expect(await createExcutor((excute) => excute())(() => 'test', resolve)()).toBe('ok yet')
    expect(resolve).toHaveBeenCalled()
    expect(resolve).toBeCalledTimes(1)
  })
})

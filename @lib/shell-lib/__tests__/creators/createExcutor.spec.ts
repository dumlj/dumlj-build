import { createExcutor } from '@/creators/createExcutor'
import { mockExec } from '@dumlj/mock-lib/src'

const COMMAND_RESPONSE_MAP = {
  test: 'ok',
  'test id': 'ok',
}

const { exec, execSync } = mockExec(COMMAND_RESPONSE_MAP)

jest.mock('child_process', () => ({
  __esModule: true,
  exec: (command: string) => exec(command),
  execSync: (command: string) => execSync(command),
}))

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

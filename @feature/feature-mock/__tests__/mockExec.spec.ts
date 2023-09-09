import { mockExec } from '@/mockExec'
import { exec as cpExec, execSync as cpExecSync } from 'child_process'

const COMMAND_RESPONSE_MAP = {
  test: 'ok',
}

const mock = mockExec(COMMAND_RESPONSE_MAP)
const exec = jest.fn(mock.exec)
const execSync = jest.fn(mock.execSync)

jest.mock('child_process', () => ({
  __esModule: true,
  exec: (command: string) => exec(command),
  execSync: (command: string) => execSync(command),
}))

describe('test mockExec', () => {
  it('can mock child_process.exec', async () => {
    const cp = cpExec('test')
    const { stdout } = cp

    const response = await new Promise((resolve) => {
      let result: string
      stdout.on('data', (stdout) => (result = stdout))
      cp.on('close', () => resolve(result))
    })

    expect(response).toBe('ok')
    expect(exec).toHaveBeenCalled()
  })

  it('can mock child_process.execSync', async () => {
    const response = cpExecSync('test')
    expect(response).toBe('ok')
    expect(execSync).toHaveBeenCalled()
  })
})

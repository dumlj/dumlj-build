import { exec, execSync } from 'child_process'

jest.mock('child_process', () => {
  const COMMAND_RESPONSE_MAP = {
    test: 'ok',
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib')>('@dumlj/mock-lib/src')
  return mockExec(COMMAND_RESPONSE_MAP)
})

describe('test mockExec', () => {
  it('can mock child_process.exec', async () => {
    const cp = exec('test')
    const { stdout } = cp

    const response = await new Promise((resolve) => {
      let result: string
      stdout.on('data', (stdout) => (result = stdout))
      cp.on('close', () => resolve(result))
    })

    expect(response).toBe('ok')
  })

  it('can mock child_process.execSync', async () => {
    const response = execSync('test')
    expect(response).toBe('ok')
  })
})

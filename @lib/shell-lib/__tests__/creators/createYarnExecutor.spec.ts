import { createYarnExecutor } from '@/creators/createYarnExecutor'

jest.mock('child_process', () => {
  const COMMAND_RESPONSE_MAP = {
    test: 'ok',
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib/src')>('@dumlj/mock-lib/src')
  return mockExec(COMMAND_RESPONSE_MAP)
})

let enableCommandExistsMock = true
jest.mock('command-exists', () => ({
  __esModule: true,
  default: () => enableCommandExistsMock,
}))

describe('test services/createYarnExecutor', () => {
  it('can create command function', async () => {
    const execute = createYarnExecutor(() => 'test')
    expect(typeof execute).toBe('function')
    expect(typeof execute.sync).toBe('function')

    expect(await execute()).toBe('ok')
    expect(execute.sync()).toBe('ok')
  })

  it('will return empty when yarn no install', async () => {
    enableCommandExistsMock = false

    const execute = createYarnExecutor(() => 'test')
    expect(await execute()).toBe('')
  })
})

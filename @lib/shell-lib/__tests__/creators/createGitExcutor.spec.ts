import { createGitExcutor } from '@/creators/createGitExcutor'

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

describe('test services/createGitExcutor', () => {
  it('can create command function', async () => {
    const execute = createGitExcutor(() => 'test')
    expect(typeof execute).toBe('function')
    expect(typeof execute.sync).toBe('function')

    expect(await execute()).toBe('ok')
    expect(execute.sync()).toBe('ok')
  })

  it('will return empty when git no install', async () => {
    enableCommandExistsMock = false

    const execute = createGitExcutor(() => 'test')
    expect(await execute()).toBe('')
  })
})

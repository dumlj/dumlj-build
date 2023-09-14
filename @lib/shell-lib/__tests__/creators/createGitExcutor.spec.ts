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
    const excute = createGitExcutor(() => 'test')
    expect(typeof excute).toBe('function')
    expect(typeof excute.sync).toBe('function')

    expect(await excute()).toBe('ok')
    expect(excute.sync()).toBe('ok')
  })

  it('will return empty when git no install', async () => {
    enableCommandExistsMock = false

    const excute = createGitExcutor(() => 'test')
    expect(await excute()).toBe('')
  })
})

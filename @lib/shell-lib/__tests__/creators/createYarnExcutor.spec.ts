import { createYarnExcutor } from '@/creators/createYarnExcutor'

jest.mock('child_process', () => {
  const COMMAND_RESPONSE_MAP = {
    test: 'ok',
  }

  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib')>('@dumlj/mock-lib/src')
  return mockExec(COMMAND_RESPONSE_MAP)
})

let enableCommandExistsMock = true
jest.mock('command-exists', () => ({
  __esModule: true,
  default: () => enableCommandExistsMock,
}))

describe('test services/createYarnExcutor', () => {
  it('can create command function', async () => {
    const excute = createYarnExcutor(() => 'test')
    expect(typeof excute).toBe('function')
    expect(typeof excute.sync).toBe('function')

    expect(await excute()).toBe('ok')
    expect(excute.sync()).toBe('ok')
  })

  it('will return empty when yarn no install', async () => {
    enableCommandExistsMock = false

    const excute = createYarnExcutor(() => 'test')
    expect(await excute()).toBe('')
  })
})

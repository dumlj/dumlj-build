import { createYarnExcutor } from '@/creators/createYarnExcutor'
import { mockExec } from '@dumlj/feature-mock/src'

const COMMAND_RESPONSE_MAP = {
  test: 'ok',
}

const { exec, execSync } = mockExec(COMMAND_RESPONSE_MAP)

jest.mock('child_process', () => ({
  __esModule: true,
  exec: (command: string) => exec(command),
  execSync: (command: string) => execSync(command),
}))

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

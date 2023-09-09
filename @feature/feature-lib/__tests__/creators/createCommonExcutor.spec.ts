import { createCommonExcutor } from '@/creators/createCommonExcutor'
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

describe('test services/createCommonExcutor', () => {
  it('can create command function', async () => {
    const excute = createCommonExcutor(() => 'test')
    expect(typeof excute).toBe('function')
    expect(typeof excute.sync).toBe('function')

    expect(await excute()).toBe('ok')
    expect(excute.sync()).toBe('ok')
  })
})

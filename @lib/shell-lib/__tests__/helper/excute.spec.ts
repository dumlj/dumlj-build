import { excute, excuteSync } from '@/helpers/excute'
import { mockExec } from '@dumlj/mock-lib/src'

const COMMAND_RESPONSE_MAP = {
  test: 'ok',
}

const { exec, execSync } = mockExec(COMMAND_RESPONSE_MAP)

jest.mock('child_process', () => ({
  __esModule: true,
  exec: (command: string) => exec(command),
  execSync: (command: string) => execSync(command),
}))

describe('test helper/excute', () => {
  it('can excute shell', async () => {
    expect(await excute('test')).toEqual('ok')
    expect(excuteSync('test')).toEqual('ok')
  })
})

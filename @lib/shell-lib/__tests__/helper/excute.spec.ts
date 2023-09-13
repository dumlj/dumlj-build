import { excute, excuteSync } from '@/helpers/excute'

jest.mock('child_process', () => {
  const COMMAND_RESPONSE_MAP = {
    test: 'ok',
  }

  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib')>('@dumlj/mock-lib/src')
  return mockExec(COMMAND_RESPONSE_MAP)
})

describe('test helper/excute', () => {
  it('can excute shell', async () => {
    expect(await excute('test')).toEqual('ok')
    expect(excuteSync('test')).toEqual('ok')
  })
})

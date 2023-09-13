import { gitCommitHash } from '@/git/gitCommitHash'

jest.mock('child_process', () => {
  const COMMAND_RESPONSE_MAP = {
    'git rev-parse --short HEAD': `ok`,
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib')>('@dumlj/mock-lib/src')
  return mockExec(COMMAND_RESPONSE_MAP)
})

describe('test git/gitChangedFiles', () => {
  it('can clone git repository', async () => {
    expect(await gitCommitHash()).toBe('ok')
    expect(gitCommitHash.sync()).toBe('ok')
  })
})

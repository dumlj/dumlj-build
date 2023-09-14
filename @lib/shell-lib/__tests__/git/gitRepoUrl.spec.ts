import { gitRepoUrl } from '@/git/gitRepoUrl'

jest.mock('child_process', () => {
  const COMMAND_RESPONSE_MAP = {
    'git remote -v': ['origin  https://github.com/dumlj/dumlj.git (fetch)', 'origin  https://github.com/dumlj/dumlj.git (push)'].join('\n'),
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib/src')>('@dumlj/mock-lib/src')
  return mockExec(COMMAND_RESPONSE_MAP)
})

describe('test git/gitRepoUrl', () => {
  it('can get repo url', async () => {
    expect(await gitRepoUrl()).toBe('https://github.com/dumlj/dumlj.git')
    expect(gitRepoUrl.sync()).toBe('https://github.com/dumlj/dumlj.git')
  })
})

import { gitClone } from '@/git/gitClone'

jest.mock('child_process', () => {
  const COMMAND_RESPONSE_MAP = {
    'git clone a b': `ok`,
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib/src')>('@dumlj/mock-lib/src')
  return mockExec(COMMAND_RESPONSE_MAP)
})

describe('test git/gitChangedFiles', () => {
  it('can clone git repository', async () => {
    expect(await gitClone({ url: 'a', dist: 'b' })).toBe('ok')
    expect(gitClone.sync({ url: 'a', dist: 'b' })).toBe('ok')
  })
})

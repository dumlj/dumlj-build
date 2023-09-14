import { gitContributors } from '@/git/gitContributors'

jest.mock('child_process', () => {
  const COMMAND_RESPONSE_MAP = {
    'git log --pretty="%an %ae%n%cn %ce"': ['DavidJones qowera@gmail.com', 'David Jones qowera@qq.com'].join('\n'),
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib/src')>('@dumlj/mock-lib/src')
  return mockExec(COMMAND_RESPONSE_MAP)
})

describe('test git/gitChangedFiles', () => {
  it('can find all contributors', async () => {
    const result = [
      {
        name: 'DavidJones',
        email: 'qowera@gmail.com',
      },
      {
        name: 'David Jones',
        email: 'qowera@qq.com',
      },
    ]

    expect(await gitContributors()).toStrictEqual(result)
    expect(gitContributors.sync()).toStrictEqual(result)
  })
})

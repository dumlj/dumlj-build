import { gitContributors } from '@/shell/git/gitContributors'
import { mockExec } from '@dumlj/feature-mock/src'

const COMMAND_RESPONSE_MAP = {
  'git log --pretty="%an %ae%n%cn %ce"': ['DavidJones qowera@gmail.com', 'David Jones qowera@qq.com'].join('\n'),
}

const { exec, execSync } = mockExec(COMMAND_RESPONSE_MAP)

jest.mock('child_process', () => ({
  __esModule: true,
  exec: (command: string) => exec(command),
  execSync: (command: string) => execSync(command),
}))

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

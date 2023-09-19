import { vol } from 'memfs'
import { tidyReadme } from '@/actions/tidyReadme'

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
jest.mock('fs', () => jest.requireActual<typeof import('memfs')>('memfs'))
jest.mock('rechoir', () => ({ prepare: jest.fn() }))
jest.mock(
  '/.readmerc.ts',
  () => ({
    configure: async () => ({
      metadatas: {
        title: 'hello world',
      },
    }),
  }),
  { virtual: true }
)

jest.mock('child_process', () => {
  const WORKSPACES = {
    a: {
      location: 'packages/a',
      workspaceDependencies: [],
      mismatchedWorkspaceDependencies: [],
    },
    b: {
      location: 'packages/b',
      workspaceDependencies: [],
      mismatchedWorkspaceDependencies: [],
    },
  }

  const COMMAND_RESPONSE_MAP = {
    'yarn --json workspaces info': `{
      "type": "log",
      "data": ${JSON.stringify(JSON.stringify(WORKSPACES, null, 2))}
    }`,
    'git log --pretty="%an %ae%n%cn %ce"': ['DavidJones qowera@gmail.com', 'David Jones qowera@qq.com'].join('\n'),
    'git remote -v': ['origin  https://github.com/dumlj/dumlj.git (fetch)', 'origin  https://github.com/dumlj/dumlj.git (push)'].join('\n'),
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib/src')>('@dumlj/mock-lib/src')
  return mockExec(COMMAND_RESPONSE_MAP)
})

describe('test actions/tidyReadme', () => {
  afterEach(() => {
    vol.reset()
  })

  it('can generate README.md for monorepo', async () => {
    vol.fromJSON({
      [`/packages/a/__readme__/TITLE.md`]: '# A',
      [`/packages/a/package.json`]: JSON.stringify({ name: 'a' }),
      [`/packages/b/__readme__/TITLE.md`]: '# B',
      [`/packages/b/package.json`]: JSON.stringify({ name: 'b' }),
      [`/package.json`]: JSON.stringify({ name: 'root', private: true, workspaces: ['packages/*'] }),
    })

    await tidyReadme({ paths: ['/'] })

    expect(vol.existsSync('/packages/a/README.md')).toBeTruthy()
    expect(vol.existsSync('/packages/b/README.md')).toBeTruthy()

    expect(-1 !== vol.readFileSync('/packages/a/README.md').indexOf('# A')).toBeTruthy()
    expect(-1 !== vol.readFileSync('/packages/b/README.md').indexOf('# B')).toBeTruthy()
  })

  it('can customize rendering data through configuration files', async () => {
    vol.fromJSON({
      [`/packages/a/__readme__/TITLE.md`]: '# {{title}}',
      [`/packages/a/package.json`]: JSON.stringify({ name: 'a' }),
      [`/packages/b/__readme__/TITLE.md`]: '# B',
      [`/packages/b/package.json`]: JSON.stringify({ name: 'b' }),
      [`/.readmerc.ts`]: `/* @see jest.mock('/.readmerc.ts', ...) */`,
      ['/tsconfig.json']: JSON.stringify({}),
      [`/package.json`]: JSON.stringify({ name: 'root', private: true, workspaces: ['packages/*'] }),
    })

    await tidyReadme({ paths: ['/'] })
    expect(vol.existsSync('/packages/a/README.md')).toBeTruthy()
    expect(-1 !== vol.readFileSync('/packages/a/README.md').indexOf('# hello world')).toBeTruthy()
  })
})

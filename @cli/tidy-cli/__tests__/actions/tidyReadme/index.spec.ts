import { vol } from 'memfs'
import { tidyReadme } from '@/actions/readme'

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
jest.mock('fs', () => jest.requireActual<typeof import('memfs')>('memfs'))
jest.mock('@dumlj/feature-prepare')
jest.mock('@dumlj/shell-lib')

describe('test actions/tidyReadme', () => {
  beforeAll(async () => {
    const { prepare } = await import('@dumlj/feature-prepare')
    jest.isMockFunction(prepare) &&
      prepare.mockImplementation(async () => ({
        configure: async () => ({
          metadatas: {
            title: 'hello world',
          },
        }),
      }))

    const { gitContributors, gitRepoUrl, yarnWorkspaces } = await import('@dumlj/shell-lib')
    jest.isMockFunction(gitContributors) &&
      gitContributors.mockImplementation(async () => {
        return [{ name: 'DavidJones', email: 'qowera@gmail.com' }]
      })

    jest.isMockFunction(gitRepoUrl) &&
      gitRepoUrl.mockImplementation(async () => {
        return 'https://github.com/dumlj/dumlj.git'
      })

    jest.isMockFunction(yarnWorkspaces) &&
      yarnWorkspaces.mockImplementation(async () => {
        return [
          {
            name: 'a',
            location: 'packages/a',
            workspaceDependencies: [],
            mismatchedWorkspaceDependencies: [],
          },
          {
            name: 'b',
            location: 'packages/b',
            workspaceDependencies: [],
            mismatchedWorkspaceDependencies: [],
          },
        ]
      })
  })

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

  it('can exclude some unnecessary projects', async () => {
    vol.fromJSON({
      [`/packages/a/__readme__/TITLE.md`]: '# A',
      [`/packages/a/package.json`]: JSON.stringify({ name: 'a' }),
      [`/packages/b/__readme__/TITLE.md`]: '# B',
      [`/packages/b/package.json`]: JSON.stringify({ name: 'b' }),
      [`/package.json`]: JSON.stringify({ name: 'root', private: true, workspaces: ['packages/*'] }),
    })

    await tidyReadme({ paths: ['/'], exclude: ['packages/a'] })
    expect(vol.existsSync('/packages/a/README.md')).toBeFalsy()
    expect(vol.existsSync('/packages/b/README.md')).toBeTruthy()
  })

  it('can only compile specified projects', async () => {
    vol.fromJSON({
      [`/packages/a/__readme__/TITLE.md`]: '# A',
      [`/packages/a/package.json`]: JSON.stringify({ name: 'a' }),
      [`/packages/b/__readme__/TITLE.md`]: '# B',
      [`/packages/b/package.json`]: JSON.stringify({ name: 'b' }),
      [`/package.json`]: JSON.stringify({ name: 'root', private: true, workspaces: ['packages/*'] }),
    })

    await tidyReadme({ paths: ['/'], include: ['packages/a'] })
    expect(vol.existsSync('/packages/a/README.md')).toBeTruthy()
    expect(vol.existsSync('/packages/b/README.md')).toBeFalsy()
  })
})

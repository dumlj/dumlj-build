import path from 'path'
import { tidyTscfg } from '@/actions/tscfg'
import { vol } from 'memfs'

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
jest.mock('fs', () => jest.requireActual<typeof import('memfs')>('memfs'))
jest.mock('@dumlj/util-lib')

describe('test actions/tidyTscfg', () => {
  beforeAll(async () => {
    const { findWorkspaceProject, findWorkspaceRootPath } = await import('@dumlj/util-lib')
    jest.isMockFunction(findWorkspaceProject) &&
      findWorkspaceProject.mockImplementation(async () => {
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
            workspaceDependencies: ['a'],
            mismatchedWorkspaceDependencies: [],
          },
        ]
      })

    jest.isMockFunction(findWorkspaceRootPath) &&
      findWorkspaceRootPath.mockImplementation(async () => {
        return '/'
      })
  })

  beforeEach(() => {
    vol.reset()

    const pkgSource = JSON.stringify({ name: 'x', private: true, workspaces: ['packages/*'] })
    vol.fromJSON({
      '/package.json': pkgSource,
      '/packages/a/package.json': JSON.stringify({ name: 'a', version: '1.0.0' }),
      '/packages/a/tsconfig.json': JSON.stringify({ compilerOptions: { rootDir: 'aSrc' } }),
      '/packages/b/package.json': JSON.stringify({ dependencies: { a: '^1.0.0' } }),
      '/packages/b/tsconfig.json': JSON.stringify({ compilerOptions: { rootDir: 'bSrc' } }),
    })
  })

  it('can build tsconfig.json with references.', async () => {
    await tidyTscfg({ tsconfig: 'tsconfig.json', output: 'tsconfig.build.json' })

    const files = vol.toJSON()

    expect('/packages/a/tsconfig.build.json' in files).toBeTruthy()
    expect('/packages/b/tsconfig.build.json' in files).toBeTruthy()
    expect('/tsconfig.build.json' in files).toBeTruthy()

    const rContent = JSON.parse(files['/tsconfig.build.json'])
    const aContent = JSON.parse(files['/packages/a/tsconfig.build.json'])
    const bContent = JSON.parse(files['/packages/b/tsconfig.build.json'])

    expect(aContent).toHaveProperty('compilerOptions.composite')
    expect(bContent).toHaveProperty('compilerOptions.composite')

    expect(aContent.compilerOptions.rootDir).toEqual('aSrc')
    expect(bContent.compilerOptions.rootDir).toEqual('bSrc')

    expect(bContent.references).toStrictEqual([{ path: path.normalize('../a/tsconfig.build.json') }])
    expect(bContent.references).toStrictEqual([{ path: path.normalize('../a/tsconfig.build.json') }])

    expect(rContent.references).toStrictEqual([
      {
        path: process.platform === 'win32' ? `.\\${path.normalize('./packages/a/tsconfig.build.json')}` : './packages/a/tsconfig.build.json',
      },
      {
        path: process.platform === 'win32' ? `.\\${path.normalize('./packages/b/tsconfig.build.json')}` : './packages/b/tsconfig.build.json',
      },
    ])
  })
})

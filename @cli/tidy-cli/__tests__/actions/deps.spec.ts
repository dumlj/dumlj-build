import { tidyDeps } from '@/actions/deps'
import { vol } from 'memfs'

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
jest.mock('fs', () => jest.requireActual<typeof import('memfs')>('memfs'))
jest.mock('@dumlj/util-lib')
jest.mock('@dumlj/shell-lib')
jest.mock('depcheck')

describe('test actions/tidyDeps', () => {
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
        ]
      })

    jest.isMockFunction(findWorkspaceRootPath) &&
      findWorkspaceRootPath.mockImplementation(async () => {
        return '/'
      })

    const { execute } = await import('@dumlj/shell-lib')
    // mock findSiblingsVersion
    jest.isMockFunction(execute) &&
      execute.mockImplementation(async () => {
        return '1.0.0'
      })

    const { default: depcheck } = await import('depcheck')
    jest.isMockFunction(depcheck) &&
      depcheck.mockImplementation(async () => {
        return {
          missing: {
            x: ['/packages/a/src/index.ts'],
          },
          using: [],
        }
      })
  })

  beforeEach(() => {
    vol.reset()

    const pkgSource = JSON.stringify({ name: 'x', private: true, workspaces: ['packages/*'] })
    vol.fromJSON({
      '/package.json': pkgSource,
      '/packages/a/package.json': JSON.stringify({ name: 'a' }),
      '/packages/a/src/index.ts': 'import "x"',
    })
  })

  it('can add missing dependencies to package.json', async () => {
    await tidyDeps({ paths: ['/node_modules'] })
    const files = vol.toJSON()
    const { dependencies } = JSON.parse(files['/packages/a/package.json']!)
    expect(dependencies.x).toBe('^1.0.0')
  })

  it('can add missing devDependencies to package.json', async () => {
    await tidyDeps({ paths: ['/node_modules'], src: '/none' })
    const files = vol.toJSON()
    const { devDependencies } = JSON.parse(files['/packages/a/package.json']!)
    expect(devDependencies.x).toBe('^1.0.0')
  })
})

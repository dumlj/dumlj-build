import { findWorkspaceRootPath } from '@/finder/findWorkspaceRootPath'
import { vol } from 'memfs'

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
jest.mock('fs', () => jest.requireActual<typeof import('memfs')>('memfs'))

describe('test findWorkspaceRootPath', () => {
  beforeEach(() => {
    vol.reset()

    const pkgSource = JSON.stringify({ name: 'x', private: true, workspaces: ['packages/*'] })
    vol.fromJSON({
      '/package.json': pkgSource,
      '/packages/a/package.json': JSON.stringify({ name: 's' }),
      '/a/package.json': pkgSource,
    })
  })

  it('can find root path in workspace', async () => {
    expect(await findWorkspaceRootPath({ paths: ['/node_modules'] })).toBe('/')
    expect(await findWorkspaceRootPath({ paths: ['/packages/a/node_modules', '/packages/node_modules', '/node_modules'] })).toBe('/')
    expect(await findWorkspaceRootPath({ paths: ['/a/node_modules', '/node_modules'] })).toBe('/a')
  })

  it('can not change paths size', async () => {
    const paths = ['/node_modules']
    expect(await findWorkspaceRootPath({ paths })).toBe('/')
    expect(paths.length).toBe(1)
  })
})

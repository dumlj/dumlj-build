import { vol } from 'memfs'
import { findWorkspaceProject, PROJECT_CACHE } from '@/finder/findWorkspaceProject'

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
jest.mock('fs', () => jest.requireActual<typeof import('memfs')>('memfs'))

describe('finder/findWorkspaceProject', () => {
  afterEach(() => {
    PROJECT_CACHE.splice(0)
    vol.reset()
  })

  it('should find projects from a workspace', async () => {
    vol.fromJSON({
      'package.json': JSON.stringify({
        workspaces: ['packages/*'],
      }),
      'packages/package-a/package.json': JSON.stringify({
        name: 'package-a',
        version: '1.0.0',
        description: 'Package A',
        dependencies: {
          'package-b': '^1.0.0',
        },
      }),
      'packages/package-b/package.json': JSON.stringify({
        name: 'package-b',
        version: '1.0.0',
        description: 'Package B',
        dependencies: {
          'package-c': '^1.0.0',
        },
      }),
      'packages/package-c/package.json': JSON.stringify({
        name: 'package-c',
        version: '1.0.0',
        description: 'Package C',
      }),
    })

    const projects = await findWorkspaceProject({
      fromCache: false,
      cwd: '',
    })

    expect(projects).toEqual([
      {
        name: 'package-c',
        version: '1.0.0',
        description: 'Package C',
        isPrivate: false,
        location: 'packages/package-c',
        dependencies: [],
        workspaceDependencies: [],
      },
      {
        name: 'package-b',
        version: '1.0.0',
        description: 'Package B',
        isPrivate: false,
        location: 'packages/package-b',
        dependencies: ['package-c'],
        workspaceDependencies: ['package-c'],
      },
      {
        name: 'package-a',
        version: '1.0.0',
        description: 'Package A',
        isPrivate: false,
        location: 'packages/package-a',
        dependencies: ['package-b'],
        workspaceDependencies: ['package-b'],
      },
    ])
  })

  it('should find projects from a workspace with a custom pattern', async () => {
    vol.fromJSON({
      'package.json': JSON.stringify({
        workspaces: ['packages/*'],
      }),
      'packages/package-a/package.json': JSON.stringify({
        name: 'package-a',
        version: '1.0.0',
        description: 'Package A',
        dependencies: {
          'package-b': '^1.0.0',
        },
      }),
      'packages/package-b/package.json': JSON.stringify({
        name: 'package-b',
        version: '1.0.0',
        description: 'Package B',
        dependencies: {
          'package-c': '^1.0.0',
        },
      }),
      'packages/package-c/package.json': JSON.stringify({
        name: 'package-c',
        version: '1.0.0',
        description: 'Package C',
      }),
    })

    const projects = await findWorkspaceProject({
      pattern: ['packages/package-a'],
      fromCache: false,
      cwd: '',
    })

    expect(projects).toEqual([
      {
        name: 'package-a',
        version: '1.0.0',
        description: 'Package A',
        isPrivate: false,
        location: 'packages/package-a',
        dependencies: ['package-b'],
        workspaceDependencies: [],
      },
    ])
  })

  it('should find projects from a workspace with a custom pattern and cwd, and from cache', async () => {
    vol.fromJSON({
      'package.json': JSON.stringify({
        workspaces: ['packages/*'],
      }),
      'packages/package-a/package.json': JSON.stringify({
        name: 'package-a',
        version: '1.0.0',
        description: 'Package A',
        dependencies: {
          'package-b': '^1.0.0',
        },
      }),
      'packages/package-b/package.json': JSON.stringify({
        name: 'package-b',
        version: '1.0.0',
        description: 'Package B',
        dependencies: {
          'package-c': '^1.0.0',
        },
      }),
      'packages/package-c/package.json': JSON.stringify({
        name: 'package-c',
        version: '1.0.0',
        description: 'Package C',
      }),
    })

    const projects = await findWorkspaceProject({
      pattern: ['package-a'],
      cwd: 'packages',
      fromCache: true,
    })

    const cacheProjects = await findWorkspaceProject()
    expect(projects).toEqual(cacheProjects)
  })

  it('should throw an error if a project name is duplicated in the workspace', async () => {
    vol.fromJSON({
      'package.json': JSON.stringify({
        workspaces: ['packages/*'],
      }),
      'packages/package-a/package.json': JSON.stringify({
        name: 'package-a',
        version: '1.0.0',
        description: 'Package A',
        dependencies: {
          'package-b': '^1.0.0',
        },
      }),
      'packages/package-b/package.json': JSON.stringify({
        name: 'package-a',
        version: '1.0.0',
        description: 'Package A',
        dependencies: {
          'package-b': '^1.0.0',
        },
      }),
    })

    await expect(
      findWorkspaceProject({
        pattern: ['packages/*'],
        cwd: '',
      })
    ).rejects.toThrow('The project name package-a is duplicated in the workspace.\n - packages/package-b/package.json\n - packages/package-a/package.json')
  })
})

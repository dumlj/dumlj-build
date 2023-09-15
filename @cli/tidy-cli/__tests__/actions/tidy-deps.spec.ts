import { tidyDeps } from '@/actions/tidy-deps'
import { vol } from 'memfs'

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
jest.mock('fs', () => jest.requireActual<typeof import('memfs')>('memfs'))

jest.mock('child_process', () => {
  const WORKSPACES = {
    s: {
      location: 'packages/a',
      workspaceDependencies: [],
      mismatchedWorkspaceDependencies: [],
    },
  }

  const COMMAND_RESPONSE_MAP = {
    'yarn --json workspaces info': `{
      "type": "log",
      "data": ${JSON.stringify(JSON.stringify(WORKSPACES, null, 2))}
    }`,
    'npm view x version': '1.0.0',
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib/src')>('@dumlj/mock-lib/src')
  return mockExec(COMMAND_RESPONSE_MAP)
})

jest.mock('depcheck', () => {
  return async () => {
    return {
      missing: {
        x: ['/packages/a/src/index.ts'],
      },
      using: [],
    }
  }
})

describe('test actions/tidy-deps', () => {
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
    const { ['/packages/a/package.json']: source } = vol.toJSON()
    const { dependencies } = JSON.parse(source)
    expect(dependencies.x).toBe('^1.0.0')
  })

  it('can add missing devDependencies to package.json', async () => {
    await tidyDeps({ paths: ['/node_modules'], src: '/none' })
    const { ['/packages/a/package.json']: source } = vol.toJSON()
    const { devDependencies } = JSON.parse(source)
    expect(devDependencies.x).toBe('^1.0.0')
  })
})

import { tidyTscfg } from '@/actions/tidyTscfg'
import { vol } from 'memfs'

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
jest.mock('fs', () => jest.requireActual<typeof import('memfs')>('memfs'))

jest.mock('child_process', () => {
  const WORKSPACES = {
    a: {
      location: 'packages/a',
      workspaceDependencies: [],
      mismatchedWorkspaceDependencies: [],
    },
    b: {
      location: 'packages/b',
      workspaceDependencies: ['a'],
      mismatchedWorkspaceDependencies: [],
    },
  }

  const COMMAND_RESPONSE_MAP = {
    'yarn --json workspaces info': `{
      "type": "log",
      "data": ${JSON.stringify(JSON.stringify(WORKSPACES, null, 2))}
    }`,
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib/src')>('@dumlj/mock-lib/src')
  return mockExec(COMMAND_RESPONSE_MAP)
})

describe('test actions/tidy-tscfg', () => {
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

    expect(bContent.references).toStrictEqual([{ path: '../a/tsconfig.build.json' }])
    expect(bContent.references).toStrictEqual([{ path: '../a/tsconfig.build.json' }])

    expect(rContent.references).toStrictEqual([{ path: './packages/a/tsconfig.build.json' }, { path: './packages/b/tsconfig.build.json' }])
  })
})

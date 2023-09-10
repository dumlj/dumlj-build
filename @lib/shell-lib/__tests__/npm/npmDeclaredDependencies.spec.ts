import { npmDeclaredDependencies } from '@/npm/npmDeclaredDependencies'
import { mockExec } from '@dumlj/mock-lib/src'

const NAME = '@dumlj/shell-lib'
const PACKAGE = {
  version: '0.0.1',
  name: 'dumlj-build',
  dependencies: {
    '@dumlj/feat-a': {
      version: '0.0.1',
      resolved: 'file:../../@feat/feat-a',
      overridden: false,
      dependencies: {
        '@dumlj/shell-lib': {
          version: '0.0.1',
        },
      },
    },
    [`${NAME}`]: {
      version: '0.0.1',
      resolved: 'file:../../@lib/shell-lib',
      overridden: false,
    },
  },
}

const COMMAND_RESPONSE_MAP = {
  'npm ls --json --omit optional --omit peer --depth 0': JSON.stringify(PACKAGE, null, 2),
}

const { exec, execSync } = mockExec(COMMAND_RESPONSE_MAP)

jest.mock('child_process', () => ({
  __esModule: true,
  exec: (command: string) => exec(command),
  execSync: (command: string) => execSync(command),
}))

describe('test npm/npmDeclaredDependencies', () => {
  it('can get yarn regsitry url', async () => {
    const result = Object.keys(PACKAGE.dependencies).map((name) => {
      const { version } = PACKAGE.dependencies[name]
      return { name, version }
    })

    expect(await npmDeclaredDependencies()).toStrictEqual(result)
  })
})

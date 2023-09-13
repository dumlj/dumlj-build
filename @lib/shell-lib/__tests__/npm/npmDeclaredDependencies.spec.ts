import { npmDeclaredDependencies } from '@/npm/npmDeclaredDependencies'
import { PACKAGE } from './__mocks__/constants'

jest.mock('child_process', () => {
  const { PACKAGE } = jest.requireActual<typeof import('./__mocks__/constants')>('./__mocks__/constants')
  const COMMAND_RESPONSE_MAP = {
    'npm ls --json --omit optional --omit peer --depth 0': JSON.stringify(PACKAGE, null, 2),
  }

  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib')>('@dumlj/mock-lib/src')
  return mockExec(COMMAND_RESPONSE_MAP)
})

describe('test npm/npmDeclaredDependencies', () => {
  it('can get yarn regsitry url', async () => {
    const result = Object.keys(PACKAGE.dependencies).map((name) => {
      const { version } = PACKAGE.dependencies[name]
      return { name, version }
    })

    expect(await npmDeclaredDependencies()).toStrictEqual(result)
  })
})

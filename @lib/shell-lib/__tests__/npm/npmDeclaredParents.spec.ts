import { npmDeclaredParents } from '@/npm/npmDeclaredParents'
import { NAME, PACKAGE } from './__mocks__/constants'

jest.mock('child_process', () => {
  const { NAME, PACKAGE } = jest.requireActual<typeof import('./__mocks__/constants')>('./__mocks__/constants')
  const COMMAND_RESPONSE_MAP = {
    [`npm ls "${NAME}" --json --omit optional --omit peer`]: JSON.stringify(PACKAGE, null, 2),
    'npm ls --json --omit optional --omit peer --depth 0': JSON.stringify(PACKAGE, null, 2),
  }

  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib')>('@dumlj/mock-lib/src')
  return mockExec(COMMAND_RESPONSE_MAP)
})

describe('test npm/npmDeclaredParents', () => {
  it('can get yarn regsitry url', async () => {
    const result = Object.keys(PACKAGE.dependencies).map((name) => {
      const { version } = PACKAGE.dependencies[name]
      return { name, version }
    })

    expect(await npmDeclaredParents(NAME)).toStrictEqual(result)
    expect(npmDeclaredParents.sync(NAME)).toStrictEqual(result)
  })
})

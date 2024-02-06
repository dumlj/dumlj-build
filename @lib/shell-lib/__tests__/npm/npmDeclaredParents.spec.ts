import { npmDeclaredParents } from '@/npm/npmDeclaredParents'
import { NAME, PACKAGE } from './__mocks__/constants'

jest.mock('child_process', () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const { NAME, PACKAGE } = jest.requireActual<typeof import('./__mocks__/constants')>('./__mocks__/constants')
  const COMMAND_RESPONSE_MAP = {
    [`npm ls "${NAME}" --json --link --omit optional --omit peer --silent`]: JSON.stringify(PACKAGE, null, 2),
    'npm ls --json --link --omit optional --omit peer --depth 0 --silent': JSON.stringify(PACKAGE, null, 2),
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib/src')>('@dumlj/mock-lib/src')
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

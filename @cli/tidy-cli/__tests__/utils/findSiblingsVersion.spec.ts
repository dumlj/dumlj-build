import { findSiblingsVersion } from '@/utils/findSiblingsVersion'

jest.mock('child_process', () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib')>('@dumlj/mock-lib/src')
  return mockExec({
    'npm view x version': '1.0.0',
  })
})

describe('test utils/findSiblingsVersion', () => {
  it('can find the version from the installed dependency packages.', async () => {
    /**
     * require.resolve 无法测试
     * @see https://github.com/jestjs/jest/issues/9543
     */
    expect(await findSiblingsVersion('x')).toBe('1.0.0')
  })
})

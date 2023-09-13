import { gitChangedFiles } from '@/git/gitChangedFiles'

jest.mock('child_process', () => {
  const COMMAND_RESPONSE_MAP = {
    'git status -s': `
      ?? index.ts
    `,
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib')>('@dumlj/mock-lib/src')
  return mockExec(COMMAND_RESPONSE_MAP)
})

describe('test git/gitChangedFiles', () => {
  it('can find changed files since HEAD', async () => {
    expect(await gitChangedFiles()).toStrictEqual(['index.ts'])
    expect(gitChangedFiles.sync()).toStrictEqual(['index.ts'])
  })
})

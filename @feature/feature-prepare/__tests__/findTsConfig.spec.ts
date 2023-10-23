import path from 'path'
import { findTsConfig } from '@/findTsConfig'
import { vol } from 'memfs'

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
jest.mock('fs', () => jest.requireActual<typeof import('memfs')>('memfs'))

describe('test findTsConfig', () => {
  afterEach(() => {
    vol.reset()
  })

  it('can find recent tsconfig.', async () => {
    vol.fromJSON({
      '/tsconfig.json': JSON.stringify({}),
      '/index.ts': 'consnole.log("ok")',
      '/packages/a/tsconfig.json': JSON.stringify({}),
      '/packages/a/index.ts': 'consnole.log("ok")',
      '/packages/b/tsconfig.json': JSON.stringify({}),
      '/packages/b/path/index.ts': 'consnole.log("ok")',
    })

    expect(await findTsConfig('/packages/b/path/index.ts')).toBe(path.normalize('/packages/b/tsconfig.json'))
    expect(await findTsConfig('/packages/a/index.ts')).toBe(path.normalize('/packages/a/tsconfig.json'))
    expect(await findTsConfig('/index.ts')).toBe(path.normalize('/tsconfig.json'))
  })

  it('will return false when tsconfig not found.', async () => {
    vol.fromJSON({
      '/index.ts': 'consnole.log("ok")',
      '/packages/a/tsconfig.json': JSON.stringify({}),
      '/packages/a/index.ts': 'consnole.log("ok")',
    })

    expect(await findTsConfig('/index.ts')).toBe(false)
  })

  it('will throw error when ts file is not exists.', async () => {
    await expect(() => findTsConfig('/a.ts')).rejects.toThrowError()
  })
})

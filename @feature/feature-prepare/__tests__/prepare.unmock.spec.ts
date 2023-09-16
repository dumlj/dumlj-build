import { prepare } from '@/prepare'
import { vol } from 'memfs'

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
jest.mock('fs', () => jest.requireActual<typeof import('memfs')>('memfs'))
jest.mock('/index.ts', () => ({ content: 'ok' }), { virtual: true })

describe('test prepare with unmock rechoir', () => {
  beforeEach(() => {
    vol.fromJSON({
      '/tsconfig.json': JSON.stringify({}),
      '/index.ts': 'export const content = "ok"',
    })
  })

  afterEach(() => {
    vol.reset()
  })

  it('will throw error when required dependencies are not installed.', async () => {
    await expect(() => prepare('/index.ts')).rejects.toThrowError()
  })
})

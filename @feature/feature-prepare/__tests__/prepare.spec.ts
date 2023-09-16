import { prepare } from '@/prepare'
import { vol } from 'memfs'

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
jest.mock('fs', () => jest.requireActual<typeof import('memfs')>('memfs'))
jest.mock('rechoir', () => ({ prepare: jest.fn() }))
jest.mock('/index.ts', () => ({ content: 'ok' }), { virtual: true })

describe('test prepare', () => {
  beforeEach(() => {
    vol.fromJSON({
      '/tsconfig.json': JSON.stringify({}),
      '/index.ts': 'export const content = "ok"',
    })
  })

  afterEach(() => {
    vol.reset()
  })

  it('can require ts file', async () => {
    expect(await prepare('/index.ts')).toStrictEqual({ content: 'ok' })
  })

  it('can obtain stats through the onResolved option', async () => {
    let tsConfig: Record<string, string>

    const onResolved = jest.fn((content) => (tsConfig = content))
    expect(await prepare('/index.ts', { cwd: '/', ts: { onResolved } })).toStrictEqual({ content: 'ok' })
    expect(onResolved).toHaveBeenCalled()
    expect(tsConfig.ts).toEqual('index.ts')
    expect(tsConfig.tsconfig).toEqual('tsconfig.json')
  })
})

import { vol } from 'memfs'
import { compileSnippets } from '@/compileSnippets'

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
jest.mock('fs', () => jest.requireActual<typeof import('memfs')>('memfs'))

describe('test actions/tidyReadme/compile', () => {
  afterEach(() => {
    vol.reset()
  })

  it('will return renderer', async () => {
    vol.fromJSON({
      '/a/b/c/d/__readme__/TITLE.md': '# {{title}}',
    })

    const snippets = ['TITLE.md']
    const lookupPaths = ['/a/b/c/d/__readme__']
    const render = await compileSnippets({ snippets, lookupPaths })
    expect(typeof render === 'function').toBeTruthy()
    expect(render({ title: 'hello world' })).toEqual('# hello world')
  })

  it('will return an empty array when the file is not found', async () => {
    const snippets = ['TITLE.md']
    const lookupPaths = ['/__readme__']
    const render = await compileSnippets({ snippets, lookupPaths })
    expect(typeof render === 'function').toBeTruthy()
  })

  it('can compile nearest file using lookupPaths parameter', async () => {
    vol.fromJSON({
      '/a/b/c/d/__readme__/TITLE.md': '# A',
      '/a/__readme__/TITLE.md': '# B',
    })

    const snippets = ['TITLE.md']
    const lookupPaths = ['/a/__readme__', '/a/b/c/d/__readme__']
    const render = await compileSnippets({ snippets, lookupPaths })
    expect(typeof render === 'function').toBeTruthy()
    expect(render({ title: 'hello world' })).toEqual('# B')
  })
})

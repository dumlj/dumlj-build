import { vol } from 'memfs'
import { compile } from '@/actions/tidyReadme/compile'

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

    const files = ['TITLE.md']
    const lookupPaths = ['/a/b/c/d/__readme__']
    const renders = await compile({ files, lookupPaths })
    expect(Array.isArray(renders)).toBeTruthy()
    expect(renders).toHaveLength(1)

    const [render] = renders
    expect(render({ title: 'hello world' })).toEqual('# hello world')
  })

  it('will return an empty array when the file is not found', async () => {
    const files = ['TITLE.md']
    const lookupPaths = ['/__readme__']
    const renders = await compile({ files, lookupPaths })
    expect(Array.isArray(renders)).toBeTruthy()
    expect(renders).toHaveLength(0)
  })

  it('can compile nearest file using lookupPaths parameter', async () => {
    vol.fromJSON({
      '/a/b/c/d/__readme__/TITLE.md': '# A',
      '/a/__readme__/TITLE.md': '# B',
    })

    const files = ['TITLE.md']
    const lookupPaths = ['/a/__readme__', '/a/b/c/d/__readme__']
    const renders = await compile({ files, lookupPaths })
    expect(Array.isArray(renders)).toBeTruthy()
    expect(renders).toHaveLength(1)

    const [render] = renders
    expect(render({ title: 'hello world' })).toEqual('# B')
  })
})

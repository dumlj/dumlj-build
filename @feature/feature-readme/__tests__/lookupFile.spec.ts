import path from 'path'
import { vol } from 'memfs'
import { lookupFile } from '@/lookupFile'

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
jest.mock('fs', () => jest.requireActual<typeof import('memfs')>('memfs'))

describe('test actions/tidyReadme/lookupFile', () => {
  afterEach(() => {
    vol.reset()
  })

  it('can lookup file name according to input paths', async () => {
    vol.fromJSON({
      '/a/b/c/d/__readme__/TITLE.md': '',
    })

    const paths = ['/a/b/c/d/__readme__', '/a/b/c/__readme__']
    expect(await lookupFile('TITLE.md', paths)).toEqual(path.normalize('/a/b/c/d/__readme__/TITLE.md'))
  })

  it('search file according to order of input paths', async () => {
    vol.fromJSON({
      '/a/b/c/d/__readme__/TITLE.md': '',
      '/__readme__/TITLE.md': '',
    })

    const paths = ['/__readme__', '/a/__readme__', '/a/b/__readme__', '/a/b/c/__readme__', '/a/b/c/d/__readme__']
    expect(await lookupFile('TITLE.md', paths)).toEqual(path.normalize('/__readme__/TITLE.md'))
  })

  it('will return undefined when file not exists', async () => {
    const paths = ['/__readme__']

    expect(await lookupFile('TITLE.md', paths)).toBeUndefined()
  })
})

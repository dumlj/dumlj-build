import { createKey } from '@/utils/createKey'

describe('test utils/createKey', () => {
  it('can create a file key of cdn.', () => {
    const prefix = '/20231030/'
    const filename = '/main.js'
    expect(createKey(filename, { prefix })).toEqual(`/20231030/main.js`)
  })

  it('can output key based on relative directory', () => {
    const prefix = '/20231030/'
    const filename = '/dumlj/main.js'
    const directory = '/dumlj/'
    // rootPath equals '/' by default
    expect(createKey(filename, { prefix, directory })).toEqual(`/20231030/dumlj/main.js`)

    const rootPath = '/dumlj/'
    expect(createKey(filename, { prefix, rootPath, directory })).toEqual(`/20231030/main.js`)
  })
})

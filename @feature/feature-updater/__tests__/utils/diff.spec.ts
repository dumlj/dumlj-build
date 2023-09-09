import { diff } from '@/utils/diff'

describe('test utils/diff', () => {
  it('can compare major version', () => {
    expect(diff('1.0.0', '2.0.0')).toEqual('major')
    expect(diff('1.0.0', '2.0.0-alpha.1')).toEqual('premajor')
  })

  it('can compare minor version', () => {
    expect(diff('1.0.0', '1.1.0')).toEqual('minor')
    expect(diff('1.0.0', '1.1.0-alpha.1')).toEqual('preminor')
  })

  it('can compare patch version', () => {
    expect(diff('1.0.0', '1.0.1')).toEqual('patch')
    expect(diff('1.0.0', '1.0.1-alpha.1')).toEqual('prepatch')
  })

  it('will return false if the versions are the same', () => {
    expect(diff('1.0.0', '1.0.0')).toEqual(false)
  })

  it('will throw error when input invalid versions', () => {
    expect(() => diff('abc', 'bcd')).toThrow(Error)
  })
})

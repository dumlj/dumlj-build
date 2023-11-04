import { mapPathsToOrbitTree } from '@/orbit'

describe('test orbit/mapPathsToOrbitTree', () => {
  it('can convert paths to tree', () => {
    // prettier-ignore
    const tree = mapPathsToOrbitTree([
      ['build', 'main'],
      ['build', 'services', 'logger'],
      ['build', 'utils', 'print'],
    ])

    expect(tree.path).toEqual([])
    expect(tree.value).toEqual('')
    expect(tree.isLatest).toEqual(false)
    expect(tree.children instanceof Set).toBeTruthy()
  })
})

import { mapFilesToOrbitTree } from '@/finder'

describe('test finder/mapPathsToOrbitTree', () => {
  it('can convert array of files to tree', () => {
    const files = ['build/main.js', 'build/services/logger.js', 'build/utils/print.js']
    const tree = mapFilesToOrbitTree(files)!

    expect(tree.path).toEqual([])
    expect(tree.value).toEqual('')
    expect(tree.isLatest).toEqual(false)
    expect(tree.children instanceof Set).toBeTruthy()
  })
})

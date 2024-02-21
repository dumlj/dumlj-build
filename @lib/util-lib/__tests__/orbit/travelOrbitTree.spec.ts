import { mapPathsToOrbitTree, travelOrbitTree } from '@/orbit'

describe('test orbit/travelOrbitTree', () => {
  it('can travel orbit tree', () => {
    // prettier-ignore
    const tree = mapPathsToOrbitTree([
      ['build', 'main'],
      ['build', 'services', 'logger'],
      ['build', 'utils', 'print'],
    ])!

    travelOrbitTree(tree)((node) => {
      expect(node).toHaveProperty('path')
      expect(node).toHaveProperty('value')
      expect(node).toHaveProperty('isLatest')
      expect(node).toHaveProperty('children')
      expect(node).toHaveProperty('siblings')

      if (['main', 'services', 'utils'].includes(node.value)) {
        expect(node.path).toEqual(['build'])
      }

      if (node.value === 'logger') {
        expect(node.path).toEqual(['build', 'services'])
      }

      if (node.value === 'print') {
        expect(node.path).toEqual(['build', 'utils'])
      }
    })
  })
})

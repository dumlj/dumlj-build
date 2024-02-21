import { mapPathsToOrbitTree, stringifyOrbitTree } from '@/orbit'

describe('test orbit/stringifyOrbitTree', () => {
  it('can stringify orbit tree', () => {
    // prettier-ignore
    const tree = mapPathsToOrbitTree([
      ['build', 'main'],
      ['build', 'services', 'logger'],
      ['build', 'utils', 'print'],
    ])!

    const messages = stringifyOrbitTree(tree)
    expect(messages).toEqual([
      { orbit: '└─┬', content: ['build'], isLatest: false },
      { orbit: '  ├─┬─', content: ['build', 'services'], isLatest: false },
      { orbit: '  │ └───', content: ['build', 'services', 'logger'], isLatest: true },
      { orbit: '  ├─┬─', content: ['build', 'utils'], isLatest: false },
      { orbit: '  │ └───', content: ['build', 'utils', 'print'], isLatest: true },
      { orbit: '  └───', content: ['build', 'main'], isLatest: true },
    ])
  })
})

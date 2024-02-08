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

  it('should create an OrbitTree from an array of paths', () => {
    const paths = [
      ['foo', 'bar'],
      ['foo', 'baz'],
      ['foo', 'bar', 'baz'],
      ['foo', 'bar', 'qux'],
    ]

    const tree = mapPathsToOrbitTree(paths)
    expect(tree.path).toEqual([])
    expect(tree.value).toEqual('')
    expect(tree.isLatest).toEqual(false)
    expect(tree.children.size).toEqual(1)

    const [node] = tree.children
    expect(node.path).toEqual([])
    expect(node.value).toEqual('foo')
    expect(node.children.size).toEqual(2)

    const [n1, n2] = node.children

    expect(n1).toEqual({
      path: ['foo'],
      value: 'bar',
      isLatest: false,
      children: new Set([
        {
          path: ['foo', 'bar'],
          value: 'baz',
          isLatest: true,
          children: new Set(),
        },
        {
          path: ['foo', 'bar'],
          value: 'qux',
          isLatest: true,
          children: new Set(),
        },
      ]),
    })

    expect(n2).toEqual({
      path: ['foo'],
      value: 'baz',
      isLatest: true,
      children: new Set(),
    })
  })

  it('should handle paths with duplicate elements', () => {
    const paths = [
      ['foo', 'bar'],
      ['foo', 'bar'],
      ['foo', 'bar', 'baz'],
      ['foo', 'bar', 'baz'],
    ]

    const tree = mapPathsToOrbitTree(paths)
    expect(tree.children.size).toEqual(1)

    const [node] = tree.children
    expect(node.path).toEqual([])
    expect(node.value).toEqual('foo')
    expect(node.children.size).toEqual(1)
  })

  it('should handle paths with empty elements', () => {
    const paths = [[''], ['foo', ''], ['foo', 'bar', '']]

    const tree = mapPathsToOrbitTree(paths)
    expect(tree.children.size).toEqual(2)

    const [empty, foo] = Array.from(tree.children)
    expect(empty).toEqual({
      path: [],
      value: '',
      isLatest: true,
      children: new Set(),
    })

    expect(foo.path).toEqual([])
    expect(foo.value).toEqual('foo')
    expect(foo.isLatest).toEqual(false)
    expect(foo.children.size).toEqual(2)

    const [emptyFoo, bar] = Array.from(foo.children)
    expect(emptyFoo).toEqual({
      path: ['foo'],
      value: '',
      isLatest: true,
      children: new Set(),
    })

    expect(bar.path).toEqual(['foo'])
    expect(bar.value).toEqual('bar')
    expect(bar.isLatest).toEqual(false)
    expect(bar.children.size).toEqual(1)
    expect(bar.children).toEqual(
      new Set([
        {
          path: ['foo', 'bar'],
          value: '',
          isLatest: true,
          children: new Set(),
        },
      ])
    )
  })
})

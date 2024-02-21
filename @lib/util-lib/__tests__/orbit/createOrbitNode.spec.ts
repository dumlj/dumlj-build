import { createOrbitNode } from '@/orbit'

describe('test orbit/createOrbitNode', () => {
  it('should create an OrbitNode with the given path, value, and isLatest flag', () => {
    const node = createOrbitNode(['bar', 'foo'], true)!

    expect(node).toHaveProperty('path', ['bar'])
    expect(node).toHaveProperty('value', 'foo')
    expect(node).toHaveProperty('isLatest', true)
    expect(node.children instanceof Set).toBeTruthy()
    expect(node.children.size).toEqual(0)
  })

  it('should create an OrbitNode with the given path, value, isLatest flag, and children', () => {
    const child1 = createOrbitNode(['foo', 'bar', 'baz'], false)!
    const child2 = createOrbitNode(['foo', 'bar', 'qux'], false)!
    const node = createOrbitNode(['foo', 'bar'], true, [child1, child2])!

    expect(node).toHaveProperty('path', ['foo'])
    expect(node).toHaveProperty('value', 'bar')
    expect(node).toHaveProperty('isLatest', true)
    expect(node.children).toEqual(new Set([child1, child2]))
  })
})

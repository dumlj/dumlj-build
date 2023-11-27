import { createOrbitNode } from '@/orbit'

describe('test orbit/createOrbitNode', () => {
  it('can generate node from file', () => {
    const node = createOrbitNode(['bar', 'foo'], true)

    expect(node).toHaveProperty('path', ['bar'])
    expect(node).toHaveProperty('value', 'foo')
    expect(node).toHaveProperty('isLatest', true)
    expect(node.children instanceof Set).toBeTruthy()
    expect(node.children.size).toEqual(0)
  })
})

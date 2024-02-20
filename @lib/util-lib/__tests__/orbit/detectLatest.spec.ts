import { detectLatest, type ExtraOrbitNode } from '@/orbit'

describe('detectLatest', () => {
  it('should return false if the node has no siblings', () => {
    const node: ExtraOrbitNode = {
      path: ['a'],
      value: '1',
      isLatest: false,
      siblings: [],
    }

    const result = detectLatest(node)
    expect(result).toBe(false)
  })

  it('should return true if the node is the latest sibling', () => {
    const node: ExtraOrbitNode = {
      path: ['a'],
      value: '1',
      isLatest: true,
      siblings: [
        {
          path: ['a'],
          value: '1',
          isLatest: true,
        },
      ],
    }

    const result = detectLatest(node)
    expect(result).toBe(true)
  })

  it('should return false if the node is not the latest sibling', () => {
    const node: ExtraOrbitNode = {
      path: ['a'],
      value: '1',
      isLatest: false,
      siblings: [
        {
          path: ['b'],
          value: '2',
          isLatest: true,
        },
      ],
    }

    const result = detectLatest(node)
    expect(result).toBe(false)
  })

  it('should return true if the node and its latest sibling have the same path and value', () => {
    const node: ExtraOrbitNode = {
      path: ['a', 'b'],
      value: '1',
      isLatest: false,
      siblings: [
        {
          path: ['a', 'b'],
          value: '1',
          isLatest: true,
        },
      ],
    }

    const result = detectLatest(node)
    expect(result).toBe(true)
  })

  it('should return false if the node and its latest sibling have different paths or values', () => {
    const node: ExtraOrbitNode = {
      path: ['a', 'b'],
      value: '1',
      isLatest: true,
      siblings: [
        {
          path: ['a', 'c'],
          value: '2',
          isLatest: false,
        },
      ],
    }

    const result = detectLatest(node)
    expect(result).toBe(false)
  })
})

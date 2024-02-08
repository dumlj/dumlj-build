import { guid, ids } from '@/misc/guid'

describe('guid', () => {
  it('should generate a unique ID', () => {
    const id1 = guid()
    const id2 = guid()

    expect(id1).not.toBe(id2)
  })

  it('should generate an ID that starts with "o"', () => {
    const id = guid()

    expect(id[0]).toBe('o')
  })

  it('should generate an ID that is 8 characters long', () => {
    const id = guid()

    expect(id.length).toBe(8)
  })

  it('should generate an ID that is alphanumeric', () => {
    const id = guid()

    expect(id).toMatch(/^[a-z0-9]+$/)
  })

  it('should not generate the same ID twice', () => {
    const ids = new Set<string>()

    for (let i = 0; i < 1000; i++) {
      const id = guid()
      expect(ids.has(id)).toBe(false)
      ids.add(id)
    }
  })

  it('should use the ids Set to keep track of generated IDs', () => {
    const id1 = guid()
    const id2 = guid()

    expect(ids.has(id1)).toBe(true)
    expect(ids.has(id2)).toBe(true)
  })
})

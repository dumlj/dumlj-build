import { importOnlySupportESM } from '@/polify'

describe('polify/importOnlySupportESM', () => {
  it('should import a module that only supports ESM', async () => {
    // "unified" is only esm module

    await expect(import('unified')).rejects.toThrow('Must use import to load ES Module:')
    await expect(importOnlySupportESM('unified')).resolves.toBeDefined()
  })
})

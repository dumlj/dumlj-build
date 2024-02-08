import { importOnlySupportESM } from '@/polify'

describe('polify/importOnlySupportESM', () => {
  it('should import a module that only supports ESM', async () => {
    expect(importOnlySupportESM(require.resolve('./esm.mjs'))).resolves.toBeDefined()
  })
})

import type { Config } from '@jest/types'

export default (): Config.InitialOptions => ({
  verbose: true,
  projects: ['<rootDir>/@feature/*/jest.config.ts', '<rootDir>/@feature/*/jest.config.tsd.ts'],
})

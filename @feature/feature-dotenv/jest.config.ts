import type { Config } from '@jest/types'

export default async (): Promise<Config.InitialOptions> => {
  return {
    skipFilter: true,
    projects: [`<rootDir>/jest.config.unittest.ts`, `<rootDir>/jest.config.typetest.ts`],
  }
}

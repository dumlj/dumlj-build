import type { Config } from '@jest/types'

export default (): Config.InitialOptions => ({
  preset: 'ts-jest',
  runner: 'jest-runner',
  testMatch: ['<rootDir>/*.spec.ts'],
})

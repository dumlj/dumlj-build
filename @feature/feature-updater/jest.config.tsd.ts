import type { Config } from '@jest/types'
import { pathsToModuleNameMapper } from 'ts-jest'
import { compilerOptions } from './tsconfig.json'

const { paths: tsconfigPaths } = compilerOptions

export default (): Config.InitialOptions => ({
  preset: 'ts-jest',
  runner: 'jest-runner-tsd',
  testMatch: ['<rootDir>/__typetests__/**/*.spec.ts'],
  modulePathIgnorePatterns: ['<rootDir>/.*/__mocks__'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsconfigPaths, {
      prefix: '<rootDir>',
    }),
  },
})

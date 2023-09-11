import type { Config } from '@jest/types'
import { pathsToModuleNameMapper } from 'ts-jest'
import { compilerOptions } from './tsconfig.json'

const { paths: tsconfigPaths } = compilerOptions

export default (): Config.InitialOptions => ({
  verbose: false,
  preset: 'ts-jest',
  coverageReporters: ['json', 'html', 'text', 'cobertura'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsconfigPaths, {
      prefix: '<rootDir>',
    }),
  },
  testMatch: ['<rootDir>/__tests__/**/*.spec.ts'],
  globals: {
    'ts-jest': {
      // 必须设置 <rootDir> 否则无法读取
      tsconfig: '<rootDir>/tsconfig.json',
    },
  },
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
})

import path from 'path'
import type { Config } from '@jest/types'
import { workspaces } from './package.json'

const TIMEOUT = 30e3
const { packages } = workspaces

process.env.NODE_OPTIONS = '--experimental-vm-modules'

export default async (): Promise<Config.InitialOptions> => {
  return {
    skipFilter: true,
    testTimeout: TIMEOUT,
    coverageReporters: ['text', 'cobertura', 'html'],
    collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/**/*.d.ts'],
    projects: [
      /**
       * 规范检测
       */
      path.join(__dirname, '__standardstests__/jest.config.standards.ts'),
      /**
       * 请确保文件夹中至少拥有一个配置，否则会报错
       * Error: Can't find a root directory while resolving a config file path.
       */
      // prettier-ignore
      ...packages.filter((path) => -1 === path.indexOf('__')).flatMap((path) => [
        `<rootDir>/${path}/jest.config.unittest.ts`,
        `<rootDir>/${path}/jest.config.typetest.ts`,
      ]),
    ],
  }
}

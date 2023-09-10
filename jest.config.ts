import type { Config } from '@jest/types'
import { workspaces } from './package.json'

const { packages } = workspaces

export default async (): Promise<Config.InitialOptions> => {
  return {
    verbose: true,
    skipFilter: true,
    projects: [
      /**
       * 请确保文件夹中至少拥有一个配置，否则会报错
       * Error: Can't find a root directory while resolving a config file path.
       */
      // prettier-ignore
      ...packages.flatMap((path) => [
        `<rootDir>/${path}/jest.config.ts`,
        `<rootDir>/${path}/jest.config.tsd.ts`,
      ]),
    ],
  }
}

import { createCommonExecutor } from '../creators/createCommonExecutor'
import type { NpmLsInfo } from './types'

const command = () => `npm ls --json --link --silent`

export const npmLsDependencies = () =>
  createCommonExecutor(command, (stdout) => {
    const source = stdout.toString().trim()
    const { dependencies }: NpmLsInfo = JSON.parse(source)
    return dependencies
  })()

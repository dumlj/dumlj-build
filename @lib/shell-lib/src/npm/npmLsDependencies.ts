import { createCommonExcutor } from '../creators/createCommonExcutor'
import type { NpmLsInfo } from './types'

const command = () => `npm ls --json`

export const npmLsDependencies = createCommonExcutor(command, (stdout) => {
  const source = stdout.toString().trim()
  const { dependencies }: NpmLsInfo = JSON.parse(source)
  return dependencies
})

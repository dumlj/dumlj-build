import { npmLsDependencies } from '@dumlj/shell-lib'
import { registerCache } from '@dumlj/util-lib'
import { CLI_REGEXP } from '../constants/conf'
import { PACKAGE_NAME } from '../constants/definition'

export const CACHE_TOKEN = 'commands'
export const CommandCache = registerCache<{ commands: string[] }>('cli')

export const findCommands = async () => {
  const dependencies = await npmLsDependencies()
  const commands = Object.keys(dependencies).filter((name) => CLI_REGEXP.test(name) && name !== PACKAGE_NAME)
  await CommandCache.write(CACHE_TOKEN, { commands })
  return commands
}

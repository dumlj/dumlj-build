import { Command } from 'commander'
import { CLI_NAME, CLI_REGEXP } from '../constants/conf'
import { findCommands, CACHE_TOKEN, CommandCache } from './findCommands'

export const loadCommands = async () => {
  const cache = await CommandCache.read(CACHE_TOKEN)
  const commands = cache?.commands || (await findCommands())
  const commandMap: Map<string, Command> = new Map()
  const duplicates: Set<string> = new Set()

  await Promise.all(
    commands.map(async (moduleName) => {
      if (!(CLI_REGEXP.test(moduleName) && moduleName !== CLI_NAME)) {
        return
      }

      try {
        const module = await import(moduleName)
        Object.keys(module).forEach((key) => {
          const command = module[key]
          const isCommand = (command: unknown): command is Command => command instanceof Command
          if (!isCommand(command)) {
            return
          }

          // 必须拿已经注册的名称
          const name = command.name()
          // 没有名称则没有 command，忽略根 command
          if (!name) {
            return
          }

          // 记录重复命令
          if (commandMap.has(name)) {
            duplicates.add(name)
          }

          commandMap.set(name, command)
        })

        return module
      } catch (error) {
        // nothing todo...
      }
    })
  )

  return { commands: Array.from(commandMap.values()), duplicates }
}

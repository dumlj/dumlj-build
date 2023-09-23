import { program, Command } from 'commander'

const COMMAND_MAP = {
  concurrently: () => import('./commands/concurrently'),
}

export interface RegisterCliOptions {
  /** 根命令 */
  commander?: Command
  /** 命令 */
  commands?: Array<keyof typeof COMMAND_MAP | Command>
}

export const registerCli = async (name: string, options?: RegisterCliOptions) => {
  const { commander = program, commands = ['concurrently'] } = options || {}

  await Promise.all(
    commands.map(async (command) => {
      if (typeof command === 'string') {
        const { default: module } = await COMMAND_MAP[command]()
        commander.addCommand(module)
        return
      }

      if (command instanceof Command) {
        commander.addCommand(command)
      }
    })
  )

  const bin = ['node', name]
  const argv = process.argv.slice(bin.length)

  return commander
    .name('dumlj')
    .usage('<command> [options]')
    .option('--verbose', 'show details')
    .action(() => commander.outputHelp())
    .parseAsync(bin.concat(argv))
}

import { program } from 'commander'

export const concurrently = async (name: string, commands: string[]) => {
  await Promise.all(
    commands.map((command) => {
      const argv = ['node', name].concat(command.split(' '))
      return program.parseAsync(argv)
    })
  )
}

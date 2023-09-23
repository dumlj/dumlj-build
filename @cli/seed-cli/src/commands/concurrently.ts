import { program, type Command } from 'commander'
import { tryAction } from '../tryAction'
import { concurrently } from '../actions/concurrently'

export default program
  .command('concurrently')
  .summary('execute multiple commands at the same time')
  .argument('<commands...>')
  .action(async (commands: string[], _, command: Command) => {
    const [name] = command.parent.args
    tryAction(concurrently)(name, commands)
  })

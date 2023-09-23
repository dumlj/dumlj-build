import { program } from 'commander'
import { tryAction } from '../tryAction'
import { refresh } from '../actions/refresh'

export default program
  .command('refresh', { hidden: true })
  .summary('refresh command list')
  .description('All commands come from the @dumlj/*-cli packages, and this command will search and collect these local commands of @dumlj/*-cli packages.')
  .action(tryAction(refresh))

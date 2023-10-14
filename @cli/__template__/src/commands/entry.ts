import { tryAction } from '@dumlj/seed-cli'
import { program } from 'commander'
import { entry, type entryOptions } from '../actions/entry'

export default program
  .command('entry')
  .summary('some description')
  .action((options?: entryOptions) => tryAction(entry)(options))

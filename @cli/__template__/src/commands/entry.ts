import { tryAction } from '@dumlj/seed-cli'
import { program } from 'commander'
import { entry, type EntryOptions } from '../actions/entry'

export default program
  .command('entry')
  .summary('some description')
  .action((options?: EntryOptions) => tryAction(entry)(options))

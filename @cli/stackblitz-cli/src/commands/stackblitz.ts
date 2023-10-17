import { tryAction } from '@dumlj/seed-cli'
import { program } from 'commander'
import { stackblitz, type StackblitzOptions } from '../actions/stackblitz'

export default program
  .command('stackblitz')
  .summary('some description')
  .action((options?: StackblitzOptions) => tryAction(stackblitz)(options))

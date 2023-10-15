import { tryAction } from '@dumlj/seed-cli'
import { program } from 'commander'
import { stackblitz, type stackblitzOptions } from '../actions/stackblitz'

export default program
  .command('stackblitz')
  .summary('some description')
  .action((options?: stackblitzOptions) => tryAction(stackblitz)(options))

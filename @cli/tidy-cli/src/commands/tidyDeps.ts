import { tryAction } from '@dumlj/seed-cli'
import { program } from 'commander'
import { tidyDeps, type TidyDepsOptions } from '../actions/tidyDeps'

export default program
  .command('tidy-deps')
  .summary('organizing packages dependencies')
  .option('-n, --necessary <necessary...>', 'specify necessary dependencies')
  .option('-s, --src <src>', 'specify whether to add necessary to the dependency attribute of pacakge.json.')
  .option('--inlcude <inlcude>', 'specify pattern of filter out included projects.')
  .option('--exclude <exclude>', 'specify pattern of filter out excluded projects.')
  .action((options?: TidyDepsOptions) => tryAction(tidyDeps)(options))

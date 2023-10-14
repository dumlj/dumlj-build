import { tryAction } from '@dumlj/seed-cli'
import { program } from 'commander'
import { tidyDeps, type TidyDepsOptions } from '../actions/deps'

export const deps = program
  .command('deps')
  .summary('organizing packages dependencies for monorepo project')
  .option('-n, --necessary <necessary...>', 'specify necessary dependencies')
  .option('-s, --src <src>', 'specify whether to add necessary to the dependency attribute of pacakge.json.')
  .option('--inlcude <inlcude...>', 'specify pattern of filter out included projects.')
  .option('--exclude <exclude...>', 'specify pattern of filter out excluded projects.')
  .option('--ignore <ignore...>', 'specify pattern of filter out excluded files.')
  .action((options?: TidyDepsOptions) => tryAction(tidyDeps)(options))

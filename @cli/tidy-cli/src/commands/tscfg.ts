import { tryAction } from '@dumlj/seed-cli'
import { program } from 'commander'
import { tidyTscfg, type TidyTscfgOptions } from '../actions/tscfg'

export const tscfg = program
  .command('tscfg')
  .summary('organizing tsconfig references for monorepo project')
  .option('--tsconfig <tsconfig>', 'specify base tsconfig.json for each project')
  .option('--output <output>', 'specify the name of the tsconfig.json output.')
  .option('--inlcude <inlcude...>', 'specify pattern of filter out included projects.')
  .option('--exclude <exclude...>', 'specify pattern of filter out excluded projects.')
  .action((options?: TidyTscfgOptions) => tryAction(tidyTscfg)(options))

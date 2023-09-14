import { tryAction } from '@dumlj/seed-cli'
import { program } from 'commander'
import { tidyTscfg, type TidyTscfgOptions } from '../actions/tidy-tscfg'

program
  .command('tscfg')
  .option('--tsconfig <tsconfig>', 'specify base tsconfig.json for each project')
  .option('--output <output>', 'specify the name of the tsconfig.json output.')
  .action((options?: TidyTscfgOptions) => {
    tryAction(tidyTscfg)(options)
  })

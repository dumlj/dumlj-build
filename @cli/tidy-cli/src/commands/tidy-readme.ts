import { tryAction } from '@dumlj/seed-cli'
import { program } from 'commander'
import { tidyReadme, type TidyReadmeOptions } from '../actions/tidy-readme'

program
  .command('readme')
  .option('--pattern <pattern>', 'specify pattern of template name in project. (defualt @template/)')
  .option('--schema <schema>', 'specify name of config file. (defualt schema.ts)')
  .action((options?: TidyReadmeOptions) => tryAction(tidyReadme)(options))

import { tryAction } from '@dumlj/seed-cli'
import { program } from 'commander'
import { tidyReadme, type TidyReadmeOptions } from '../actions/tidyReadme'
import { DEFAULT_TEMPLATE_FILE_NAME, DEFAULT_OUTPUT, DEFAULT_CONFIG_FILE_NAME } from '../actions/tidyReadme/constants'

program
  .command('readme')
  .option('--config <config>', `specify name of config file. (default ${DEFAULT_CONFIG_FILE_NAME})`)
  .option('--output <output>', `specify name of output file. (default ${DEFAULT_OUTPUT})`)
  .option('--template <template>', `specify name of template folder. (default ${DEFAULT_TEMPLATE_FILE_NAME})`)
  .option('--inlcude <inlcude>', 'specify pattern of filter out included projects.')
  .option('--exclude <exclude>', 'specify pattern of filter out excluded projects.')
  .action((options?: TidyReadmeOptions) => tryAction(tidyReadme)(options))

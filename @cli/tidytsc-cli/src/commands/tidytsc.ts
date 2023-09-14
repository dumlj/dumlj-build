import { tryAction } from '@dumlj/seed-cli'
import { program } from 'commander'
import { tidytsc, type TidytscOptions } from '../actions/tidytsc'

program
  .command('tsc')
  .option('--tsconfig <tsconfig>', 'specify base tsconfig.json for each project')
  .option('--output <output>', 'specify the name of the tsconfig.json output.')
  .action((options?: TidytscOptions) => {
    tryAction(tidytsc)(options)
  })

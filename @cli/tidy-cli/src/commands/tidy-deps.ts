import { tryAction } from '@dumlj/seed-cli'
import { program } from 'commander'
import { tidyDeps, type TidyDepsOptions } from '../actions/tidy-deps'

program
  .command('deps')
  .option('-n, --necessary <necessary...>', 'specify necessary dependencies')
  .option('-s, --src <src>', 'specify whether to add necessary to the dependency attribute of pacakge.json.')
  .action((options?: TidyDepsOptions) => tryAction(tidyDeps)(options))

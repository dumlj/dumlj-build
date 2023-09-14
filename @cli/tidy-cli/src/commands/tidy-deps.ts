import { tryAction } from '@dumlj/seed-cli'
import { program } from 'commander'
import { tidyDeps, type TidyDepsOptions } from '../actions/tidy-deps'

program
  .command('deps')
  .option('-d, --dependencies <dependencies>', 'specifies whether to add dependencies to the dependency attribute of pacakge.json.')
  .action((options?: TidyDepsOptions) => tryAction(tidyDeps)(options))

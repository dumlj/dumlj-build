import { tryAction } from '@dumlj/seed-cli'
import { program } from 'commander'
import { tidydep, type TidydepOptions } from '../actions/tidydep'

program
  .command('deps')
  .option('-d, --dependencies <dependencies>', 'specifies whether to add dependencies to the dependency attribute of pacakge.json.')
  .action((options?: TidydepOptions) => tryAction(tidydep)(options))

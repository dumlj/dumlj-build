import { tryAction } from '@dumlj/seed-cli'
import { Command } from 'commander'
import { tidyDeps, type TidyDepsOptions } from '../actions/deps'

const depsCommand = new Command('deps')
  .summary('organizing packages dependencies for monorepo project')
  .option('-n, --necessary <necessary...>', 'specify necessary dependencies')
  .option('-s, --src <src>', 'specify whether to add necessary to the dependency attribute of pacakge.json.')
  .option('--inlcude <inlcude...>', 'specify pattern of filter out included projects.')
  .option('--exclude <exclude...>', 'specify pattern of filter out excluded projects.')
  .option('--ignore <ignore...>', 'specify pattern of filter out excluded files.')
  .action((options?: TidyDepsOptions) => tryAction(tidyDeps)(options))

export default depsCommand

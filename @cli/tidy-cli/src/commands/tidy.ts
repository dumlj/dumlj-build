import { tryAction } from '@dumlj/seed-cli'
import { program } from 'commander'
import { tidyTscfg } from '../actions/tidy-tscfg'
import { tidyDeps } from '../actions/tidy-deps'

export interface Options {
  /**
   * pattern of filter out included projects
   * @example
   * ['packages/*']
   */
  include?: string | string[]
  /**
   * pattern of filter out excluded projects
   * @example
   * ['__tests__/*']
   */
  exclude?: string | string[]
}

program
  .option('--inlcude <inlcude>', 'specify pattern of filter out included projects.')
  .option('--exclude <exclude>', 'specify pattern of filter out excluded projects.')
  .action((options?: Options) => tryAction((options) => Promise.all([tidyTscfg(options), tidyDeps(options)]))(options))

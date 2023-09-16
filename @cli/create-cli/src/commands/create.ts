import { tryAction } from '@dumlj/seed-cli'
import { program } from 'commander'
import { create } from '../actions/create'

program
  .option('--pattern <pattern>', 'specify pattern of template name in project. (defualt @template/)')
  .option('--schema <schema>', 'specify name of config file. (defualt schema.ts)')
  .action(() => tryAction(create)())

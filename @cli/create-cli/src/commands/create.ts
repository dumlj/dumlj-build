import { tryAction } from '@dumlj/seed-cli'
import { program } from 'commander'
import { createProject, type CreateProjectOptions } from '../actions/create'
import { DEFAULT_RC_FILE, DEFAULT_TEMPLATE_PATTERN } from '../actions/create/constants'

export default program
  .command('create')
  .summary('create project by template')
  .option('--pattern <pattern>', `specify pattern of template name in project. (default ${DEFAULT_TEMPLATE_PATTERN})`)
  .option('--config <config>', `specify name of config file. (default ${DEFAULT_RC_FILE})`)
  .action((options?: CreateProjectOptions) => tryAction(createProject)(options))

import { tryAction } from '@dumlj/seed-cli'
import { program, Option } from 'commander'
import { createProject, type CreateProjectOptions } from '../actions/create'
import { DEFAULT_RC_FILE, DEFAULT_TEMPLATE_PATTERN } from '../actions/create/constants'

export default program
  .command('create')
  .summary('create project by template')
  .option('--name <name>', 'specify project name')
  .option('--description <description>', 'specify project description')
  .addOption(new Option('--template <template>', 'specify project type').choices(['cli', 'webpack-plugin']))
  .option('--pattern <pattern>', `specify pattern of template name in project. (default ${DEFAULT_TEMPLATE_PATTERN})`)
  .option('--config <config>', `specify name of config file. (default ${DEFAULT_RC_FILE})`)
  .option('--override', 'override exists project.')
  .option('--yes', 'say yes for all confirm.')
  .action((options?: CreateProjectOptions) => tryAction(createProject)(options))

import { tryAction, registerEnhancer, concatEnhancers } from '@dumlj/seed-cli'
import { Option, Command } from 'commander'
import { create, debug, type CreateOptions } from '../actions/create'
import { DEFAULT_RC_FILE, DEFAULT_TEMPLATE_PATTERN } from '../actions/create/constants'

const mapOptionsToCommand = registerEnhancer('addOption', () => [
  new Option('--name <name>', 'specify project name'),
  new Option('--description <description>', 'specify project description'),
  new Option('--template <template>', 'specify project type').choices(['cli', 'webpack-plugin', 'feature']),
  new Option('--pattern <pattern>', `specify pattern of template name in project. (default ${DEFAULT_TEMPLATE_PATTERN})`),
  new Option('--config <config>', `specify name of config file. (default ${DEFAULT_RC_FILE})`),
])

const debugCommand = mapOptionsToCommand(
  new Command('debug').summary('debug .templaterc.ts').action((options?: CreateOptions, command?: Command) => {
    if (!command?.parent) {
      return
    }

    const parentOptions = command.parent.opts()
    const finalOptions = { ...parentOptions, ...options }
    return tryAction(debug)(finalOptions)
  })
)

const mapEnhancersToCreateCommand = concatEnhancers(
  // add options to create command
  mapOptionsToCommand,
  // map debug command to create command
  registerEnhancer('addCommand', () => [debugCommand])
)

const createCommand = mapEnhancersToCreateCommand(
  new Command('create')
    .summary('create project by template')
    .option('--override', 'override exists project.')
    .option('--yes', 'say yes for all confirm.')
    .action((options: CreateOptions) => tryAction(create)(options))
)

export default createCommand

import { tryAction, registerEnhance, enhance } from '@dumlj/seed-cli'
import { Option, Command } from 'commander'
import { create, debug, type CreateOptions } from '../actions/create'
import { DEFAULT_RC_FILE, DEFAULT_TEMPLATE_PATTERN } from '../actions/create/constants'

const optionEnhance = registerEnhance('addOption', () => [
  new Option('--name <name>', 'specify project name'),
  new Option('--description <description>', 'specify project description'),
  new Option('--template <template>', 'specify project type').choices(['cli', 'webpack-plugin']),
  new Option('--pattern <pattern>', `specify pattern of template name in project. (default ${DEFAULT_TEMPLATE_PATTERN})`),
  new Option('--config <config>', `specify name of config file. (default ${DEFAULT_RC_FILE})`),
])

const debugCommand = enhance(optionEnhance)(
  new Command('debug').summary('debug .templaterc.ts').action((options?: CreateOptions, command?: Command) => {
    const parentOptions = command.parent.opts()
    const finalOptions = { ...parentOptions, ...options }
    return tryAction(debug)(finalOptions)
  })
)

const enhanceDebug = registerEnhance('addCommand', () => [debugCommand])

export default enhance(
  optionEnhance,
  enhanceDebug
)(
  new Command('create')
    .summary('create project by template')
    .option('--override', 'override exists project.')
    .option('--yes', 'say yes for all confirm.')
    .action((options: CreateOptions) => tryAction(create)(options))
)

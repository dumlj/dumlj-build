import { program } from 'commander'

import './commands/tidyDeps'
import './commands/tidyTscfg'
import './commands/tidyReadme'
import './commands/tidy'

const name = 'tidy'
const defaultArgv = ['node', name]
const argv = defaultArgv.concat(process.argv.slice(defaultArgv.length))
program.name(name).option('--verbose', '显示详情').usage('<command> [options]').parse(argv)

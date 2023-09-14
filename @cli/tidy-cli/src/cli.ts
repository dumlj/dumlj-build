import { program } from 'commander'

import './commands/tidy-deps'
import './commands/tidy-tscfg'

const name = 'tidy'
const defaultArgv = ['node', name]
const argv = defaultArgv.concat(process.argv.slice(defaultArgv.length))
program.name(name).option('--verbose', '显示详情').usage('<command> [options]').parse(argv)
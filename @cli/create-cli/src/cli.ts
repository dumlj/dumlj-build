import { program } from 'commander'

import './commands/create-project'

const name = 'dumlj-create'
const defaultArgv = ['node', name]
const argv = defaultArgv.concat(process.argv.slice(defaultArgv.length))
program.name(name).option('--verbose', '显示详情').usage('<command> [options]').parse(argv)

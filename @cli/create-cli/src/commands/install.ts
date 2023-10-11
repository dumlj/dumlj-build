import { tryAction } from '@dumlj/seed-cli'
import { createCommand } from 'commander'
import { husky } from '../actions/install/husky'

export default createCommand('install')
  .argument('[command]')
  .usage('[command]')
  .summary('easy installation')
  .addCommand(
    createCommand('husky')
      .option('-f,--force [upgrade]', 'force upgrade husky config')
      .option('--compatible', 'specify whether to use compatibility mode (used by default)')
      .action(({ force: upgrade = false, compatible = true }) => tryAction(husky)({ compatible, upgrade }))
  )

import { tryAction, registerEnhancer, concatEnhancers } from '@dumlj/seed-cli'
import { Command } from 'commander'
import { husky } from '../actions/install/husky'

const huskyCommand = new Command('husky')
  .option('-f,--force [upgrade]', 'force upgrade husky config')
  .option('--compatible', 'specify whether to use compatibility mode (used by default)')
  .action(({ force: upgrade = false, compatible = true }) => tryAction(husky)({ compatible, upgrade }))

const mapEnhancersToCreateCommand = concatEnhancers(registerEnhancer('addCommand', () => [huskyCommand]))

const installCommand = mapEnhancersToCreateCommand(new Command('install').argument('[command]').usage('[command]').summary('easy installation'))

export default installCommand

import { tryAction } from '@dumlj/seed-cli'
import { Command } from 'commander'
import { entry, type EntryOptions } from '../actions/entry'

export default new Command('entry').summary('some description').action((options?: EntryOptions) => tryAction(entry)(options))

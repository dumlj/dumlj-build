import { info } from '@dumlj/feature-pretty'
import { findCommands } from '../utils/findCommands'

export const refresh = async () => {
  const commands = await findCommands()
  if (!commands.length) {
    return
  }

  info(`Find ${commands.length} CLI modules and initialize them. ${[''].concat(commands).join('\n - ')}`)
}

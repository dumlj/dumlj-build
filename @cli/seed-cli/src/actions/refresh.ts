import { info } from '@dumlj/feature-pretty'
import { findCommands } from '../utils/findCommands'

/**
 * 刷新命令行列表
 * @description
 * 因为查找命令需要 1 秒多的时间，
 * 因此我们在 findCommands 中已经具备缓存能力，
 * 但更新缓存的时机只会是变更依赖后。
 * 为了优化这个查找过程所花的时间，专门建立一条刷新的后台进程
 * 对命令列表进行更新，让执行与更新同时执行，相当于异步执行。
 */
export const refresh = async () => {
  const commands = await findCommands()
  if (!commands.length) {
    return
  }

  info(`Find ${commands.length} CLI modules and initialize them. ${[''].concat(commands).join('\n - ')}`)
}

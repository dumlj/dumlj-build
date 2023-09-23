import { spawn } from 'child_process'
import { Command } from 'commander'
import refreshCommand from './commands/refresh'
import { registerCli } from './registerCli'
import { loadCommands } from './utils/loadCommands'
import { CLI_NAME } from './constants/conf'

/**
 * 刷新命令行列表
 * @description
 * 因为查找命令需要 1 秒多的时间，
 * 因此我们在 findCommands 中已经具备缓存能力，
 * 但更新缓存的时机只会是变更依赖后。
 * 为了优化这个查找过程所花的时间，专门建立一条刷新的后台进程
 * 对命令列表进行更新，让执行与更新同时执行，相当于异步执行。
 */
const refreshCommandList = () => {
  if (process.env.DUMLJ_CLI_REFRESH) {
    return
  }

  const cp = spawn(CLI_NAME, ['refresh'], {
    detached: true,
    stdio: 'ignore',
    env: {
      ...process.env,
      DUMLJ_CLI_REFRESH: '1',
    },
  })

  // 后台运行不再处理
  cp.unref()
}

/** 入口函数 */
const main = async () => {
  const commander = new Command()
  commander.description(
    'This CLI is used to collect all local @dumlj/*-CLI modules. \nYou can execute the corresponding program through the following commands. \nThis CLI will create a child process that collects the local CLIs and activate them on the next execution.'
  )

  // 后台刷新
  if (process.env.DUMLJ_CLI_REFRESH) {
    registerCli(CLI_NAME, { commander: commander, commands: [refreshCommand] })
    return
  }

  const { commands } = await loadCommands()
  commands.forEach((command) => commander.addCommand(command))

  registerCli(CLI_NAME, { commander: commander })
}

refreshCommandList()
main()

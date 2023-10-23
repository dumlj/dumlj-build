import { spawn } from 'child_process'
import { Command } from 'commander'
import { refresh } from './actions/refresh'
import { registerCli } from './registerCli'
import { loadCommands } from './utils/loadCommands'
import { CLI_NAME } from './constants/conf'

/** 后台执行的命令集合 */
const BGCommands = {
  refresh,
}

/** 创建后台执行的进程 */
const spawnBGProcess = (command: keyof typeof BGCommands) => {
  const cp = spawn(CLI_NAME, [command], {
    ...(process.platform === 'win32' ? { shell: true, windowsHide: true } : { detached: true }),
    stdio: 'ignore',
    env: {
      ...process.env,
      DUMLJ_CLI_COMMAND: command,
    },
  })

  // 后台运行不再处理
  cp.unref()
}

/** 入口函数 */
const main = async () => {
  // 后台刷新
  const fn = BGCommands[process.env.DUMLJ_CLI_COMMAND]
  if (typeof fn === 'function') {
    await fn()
    return
  }

  // 注册命令行
  const commander = new Command()
  commander.description(
    [
      'This CLI is used to collect all local @dumlj/*-CLI modules.',
      'You can execute the corresponding program through the following commands.',
      'This CLI will create a child process that collects the local CLIs and activate them on the next execution.',
    ].join('\n')
  )

  const { commands } = await loadCommands()
  commands.forEach((command) => commander.addCommand(command))

  registerCli(CLI_NAME, { commander: commander })

  // 创建其他后台进程执行异步执行其他命令
  Object.keys(BGCommands).forEach((name: keyof typeof BGCommands) => spawnBGProcess(name))
}

main()

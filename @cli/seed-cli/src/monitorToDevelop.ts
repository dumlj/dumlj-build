import path from 'path'
import type { MonitorOptions } from '@dumlj/shell-lib'
import { monitor } from '@dumlj/shell-lib'
import { info, clearConsole } from '@dumlj/feature-pretty'
import { debounce } from 'lodash'
import chalk from 'chalk'

export interface MonitorToDevelopOptions extends MonitorOptions {
  /** append parameters */
  argvs?: string[]
}

/**
 * develop by observing file changes
 * and spwan child process to develop
 * current shell(cli)
 */
export const monitorToDevelop = (token: string, options?: MonitorToDevelopOptions) => {
  const command = process.argv[0]
  const argvs = process.argv.slice(1)

  /** skip duplicate processes */
  if (process.env[token]) {
    return false
  }

  const { pattern = ['**/*'], cwd = process.cwd(), envs = {}, argvs: inArgvs = [] } = options || {}
  const finalArgvs = argvs.concat(inArgvs)
  const { watcher } = monitor(
    {
      command,
      argvs: finalArgvs,
    },
    {
      pattern,
      cwd,
      envs: {
        ...envs,
        [token]: '1',
      },
    }
  )

  const nextCommand = process.argv
    .slice(1, 2)
    .map((command) => path.basename(command))
    .concat(finalArgvs.slice(1))
    .join(' ')
  const MESSAGE = (_: TemplateStringsArray, file: string) =>
    ['', `file ${chalk.magentaBright(file)} has been changed.`, `execute ${chalk.magentaBright(nextCommand)}, please wait...`, ''].join('\n')

  const tips = (file: string) => {
    clearConsole()
    info(MESSAGE`${file}`)
  }

  watcher.on('change', debounce(tips, 200))

  return true
}

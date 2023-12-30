import { exec, execSync, type ExecOptions, type ExecSyncOptions } from 'child_process'

/**
 * 执行命令
 * @description
 * 兼容 exec 无法捕获错误
 */
export const execute = (command: string, options?: ExecOptions) => {
  return new Promise<string>((resolve, reject) => {
    const content = []
    const errors = []
    const cp = exec(command, options)
    const { stdout, stderr } = cp

    stderr.on('data', (chunk) => {
      const data = chunk?.toString()
      data && errors.push(data)
    })

    stdout.on('data', (chunk) => {
      const data = chunk?.toString()
      data && content.push(data)
    })

    cp.on('close', () => {
      if (errors.length > 0) {
        reject(new Error(`${command} failed.\n${errors.join('')}`))
        return
      }

      resolve(content.join(''))
    })
  })
}

/**
 * 同步执行命令
 * @description
 * 兼容 exec 无法捕获错误
 */
export const executeSync = (command: string, options?: ExecSyncOptions) => {
  try {
    const stdout = execSync(command, options)
    return stdout.toString()
  } catch (error) {
    throw new Error(error.stderr.toString())
  }
}

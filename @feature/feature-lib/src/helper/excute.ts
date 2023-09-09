import { exec, execSync, type ExecOptions, type ExecSyncOptions } from 'child_process'

/**
 * 执行命令
 * @description
 * 兼容 exec 无法捕获错误
 */
export const excute = (command: string, options?: ExecOptions) => {
  return new Promise<string>((resolve, reject) => {
    const content = []
    const errors = []
    const cp = exec(command, options)
    const { stdout, stderr } = cp

    stderr.on('data', (chunk) => errors.push(chunk.toString()))
    stdout.on('data', (chunk) => content.push(chunk.toString()))

    cp.on('close', () => {
      if (errors.length > 0) {
        reject(new Error(errors.join('')))
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
export const excuteSync = (command: string, options?: ExecSyncOptions) => {
  try {
    const stdout = execSync(command, options)
    return stdout.toString()
  } catch (error) {
    throw new Error(error.stderr.toString())
  }
}

import { exec, execSync, type ExecOptions, type ExecSyncOptions } from 'child_process'

/**
 * 执行命令
 * @description
 * 兼容 exec 无法捕获错误
 */
export function execute(command: string, options?: ExecOptions) {
  return new Promise<string>((resolve, reject) => {
    const content: string[] = []
    const errors: string[] = []
    const cp = exec(command, options)
    const { stdout, stderr } = cp

    stderr &&
      stderr.on('data', (chunk) => {
        const data: string = chunk?.toString()
        data && errors.push(data)
      })

    stdout &&
      stdout.on('data', (chunk) => {
        const data: string = chunk?.toString()
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

interface StderrError {
  stderr: {
    toString(): string
  }
}

function isStderrError(error: unknown): error is StderrError {
  return typeof error === 'object' && error !== null && 'stderr' in error
}

/**
 * 同步执行命令
 * @description
 * 兼容 exec 无法捕获错误
 */
export function executeSync(command: string, options?: ExecSyncOptions) {
  try {
    const stdout = execSync(command, options)
    return stdout.toString()
  } catch (error) {
    if (isStderrError(error)) {
      throw new Error(error.stderr.toString())
    }

    throw error
  }
}

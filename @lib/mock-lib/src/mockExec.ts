/**
 * mock childProcess
 * @description
 * 无法使用 `jest.mock` 因为 `jest.mock` 必须初始化就执行，
 * 因此 `jest.mock` 必须声明模块名与对应函数，
 * 而函数内用则可以调用其他模块
 */
export function mockExec(commands: Record<string, string>) {
  const exec = (command: string) => {
    type Handle = (content: string) => void

    let stdoutHandler: Handle
    let closeHandler: () => void

    const stdout = { on: (_: string, fn: (stdout: string) => void) => (stdoutHandler = fn) }
    const stderr = { on: jest.fn() }
    const on = (_: string, fn: () => void) => (closeHandler = fn)

    Promise.resolve().then(() => {
      if (typeof stdoutHandler === 'function') {
        stdoutHandler(commands[command])
      }

      if (typeof closeHandler === 'function') {
        closeHandler()
      }
    })

    return { stdout, stderr, on }
  }

  const execSync = (command: string) => {
    return commands[command]
  }

  return { exec, execSync }
}

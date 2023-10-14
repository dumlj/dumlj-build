import { spawn, type ChildProcess } from 'child_process'
import { debounce } from 'lodash'
import chokidar from 'chokidar'

export interface MonitorParams {
  command: string
  argvs: string[]
}

export interface MonitorOptions {
  pattern?: string | string[]
  cwd?: string
  ignore?: string | string[]
  envs?: Record<string, string>
  onClose?: () => void
}

export const monitor = (params: MonitorParams, options?: MonitorOptions) => {
  const { command, argvs } = params
  const { pattern = ['**/*'], cwd = process.cwd(), ignore = [], envs = {}, onClose } = options || {}

  /**
   * Because restarting requires freeing memory,
   * the program must be isolated
   */
  let server: ChildProcess

  const startServer = async () => {
    server = spawn(command, argvs, {
      stdio: 'inherit',
      env: {
        ...process.env,
        ...envs,
      },
    })
  }

  /**
   * As long as the service exists,
   * all startups must wait for the process to complete.
   * Here you only need to take the first kill call.
   */
  let killThread: Promise<void>

  const killServer = async () => {
    if (server?.exitCode !== null) {
      return
    }

    if (killThread) {
      return killThread
    }

    killThread = new Promise<void>((resolve) => {
      server.on('close', () => resolve())
      server.kill('SIGKILL')
    })

    killThread.finally(() => {
      killThread = undefined
    })

    return killThread
  }

  /**
   * Because the service only needs to be started once,
   * the last restart call can be taken here.
   */
  let restartThread: () => Promise<void>

  const restartServer = async (start = startServer) => {
    restartThread = start
    await killServer()
    await restartThread()
  }

  const onChanged = async () => {
    await restartServer()
  }

  const watcher = chokidar.watch(pattern, {
    cwd,
    ignored: ['node_modules', '.git'].concat(ignore),
  })

  watcher.on('change', debounce(onChanged, 200))

  const close = async () => {
    await Promise.all([watcher.close(), killServer()])

    if (typeof onClose === 'function') {
      onClose()
    }
  }

  /**
   * close server on exit
   */

  process.on('SIGINT', close)
  process.on('SIGTERM', close)

  startServer()
  return { watcher, close }
}

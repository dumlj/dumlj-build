import { spawn, type ChildProcess } from 'child_process'
import { debounce } from 'lodash'
import chokidar from 'chokidar'

export interface spawnWatchParams {
  command: string
  argvs: string[]
}

export interface WatchOptions {
  pattern?: string | string[]
  cwd?: string
  envs?: Record<string, string>
}

export const spwanWatch = (params: spawnWatchParams, options?: WatchOptions) => {
  const { command, argvs } = params
  const { pattern = ['**/*'], cwd = process.cwd(), envs = {} } = options || {}

  /**
   * Because restarting requires freeing memory,
   * the program must be isolated
   */
  let server: ChildProcess

  const startServer = async () => {
    server = spawn(command, argvs, {
      stdio: 'inherit',
      env: {
        ...envs,
        ...process.env,
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
    restartThread()
  }

  const onChanged = () => {
    const command = process.argv[0]
    const argvs = process.argv.slice(1)
    spawn(command, argvs, {
      stdio: 'inherit',
      env: {
        ...process.env,
      },
    })
  }

  const watcher = chokidar.watch(pattern, {
    cwd,
    ignored: ['node_modules', '.git'],
  })

  watcher.on('change', debounce(onChanged, 200))

  const unwatch = () => watcher.close()
  return { start: startServer, restart: restartServer, kill: killServer, unwatch }
}

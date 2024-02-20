import fs from 'fs'
import path from 'path'
import { program, Command } from 'commander'
import { warn } from './services/logger'
import { CLI_PREFIX, CLI_REGEXP, COMMAND_DIR, COMMAND_EXTNAMES } from './constants/definition'

export interface ExecuteOptions {
  cwd?: string
  commandDir: string
}

async function findCommandFiles(commandDir: string) {
  const files = await fs.promises.readdir(commandDir)
  const generateCommandFiles = function* () {
    for (const filename of files) {
      const file = path.join(commandDir, filename)
      if (!(COMMAND_EXTNAMES.includes(path.extname(filename)) && fs.existsSync(file))) {
        continue
      }

      yield file
    }
  }

  return Array.from(generateCommandFiles())
}

async function findCommandModule(options?: ExecuteOptions) {
  const { cwd = process.cwd(), commandDir = COMMAND_DIR } = options || {}
  const cliDir = path.join(cwd, `node_modules/${CLI_PREFIX}`)
  const folders = await fs.promises.readdir(cliDir)
  const commandFiles = await Promise.all(
    Array.from(
      (function* () {
        for (const folder of folders) {
          const name = `${CLI_PREFIX}/${folder}`
          if (!CLI_REGEXP.test(name)) {
            continue
          }

          const dir = path.join(cliDir, folder, commandDir)
          if (!fs.existsSync(dir)) {
            continue
          }

          yield findCommandFiles(dir)
        }
      })()
    )
  )

  return commandFiles.flatMap((files) => files.map((file) => import(file)))
}

export async function execute(options: ExecuteOptions) {
  const loaders = await findCommandModule(options)
  const results = await Promise.allSettled(loaders)
  const valid = results.filter((result) => {
    if (result.status !== 'fulfilled') {
      return
    }

    const { default: command } = result.value
    if (!(command instanceof Command)) {
      return
    }

    program.addCommand(command)
    return true
  })

  if (valid.length === 0) {
    warn(`No command was found.`, { verbose: false })
    return
  }

  program.parseAsync(process.argv)
}

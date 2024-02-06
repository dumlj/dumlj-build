import fs from 'fs'
import path from 'path'
import { program, Command } from 'commander'
import { COMMAND_DIR } from './constants/definition'
import { readRootPathThroughBin } from './utils/readRootPathThroughBin'

export interface ExecuteConfig {
  dir: string
  commandDir: string
}

export async function execute(config: ExecuteConfig) {
  const { dir: binDir, commandDir = COMMAND_DIR } = config
  const cliDir = await readRootPathThroughBin(binDir)
  const dir = path.join(cliDir, commandDir)
  const files = await fs.promises.readdir(dir)
  const promises = Array.from(
    (function* () {
      const extnames = ['.mjs', '.js']
      for (const filename of files) {
        const file = path.join(dir, filename)
        if (!(extnames.includes(path.extname(filename)) && fs.existsSync(file))) {
          continue
        }

        yield import(file)
      }
    })()
  )

  const results = await Promise.allSettled(promises)
  for (const result of results) {
    if (result.status !== 'fulfilled') {
      continue
    }

    const { default: command } = result.value
    if (!(command instanceof Command)) {
      continue
    }

    program.addCommand(command)
  }

  program.parseAsync(process.argv)
}

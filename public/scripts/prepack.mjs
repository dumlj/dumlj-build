import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import stream from 'stream'
import { promisify } from 'util'

const finished = promisify(stream.finished)

/** run shell command */
async function shell(command, options) {
  const [cmd, ...args] = command.split(' ')
  const cp = spawn(cmd, args, options)

  const chunks = []
  cp.stdout.on('data', (chunk) => chunks.push(chunk))

  /** wait for command to finish */
  await finished(cp.stdout)
  return Buffer.concat(chunks).toString()
}

/** find all projects in workspace */
async function findProjects() {
  const json = await shell('pnpm m ls --json --depth=-1')
  const projects = JSON.parse(json.trim())
  return projects.map(({ path: location, private: isPrivate, ...rest }) => {
    return { ...rest, location, isPrivate }
  })
}

/** update attribute types in package.json */
async function updatePackage(location) {
  const file = path.join(location, 'package.json')
  const json = await fs.promises.readFile(file, 'utf-8')
  const config = JSON.parse(json)
  if (typeof config?.types !== 'string') {
    return
  }

  config.types = './libs/index.d.ts'
  await fs.promises.writeFile(file, JSON.stringify(config, null, 2))
}

/** modify all "package.json" in the workspace */
async function prepack() {
  const projects = await findProjects()
  const promises = Array.from(
    (function* () {
      for (const { isPrivate, location } of projects) {
        if (isPrivate) {
          continue
        }

        yield updatePackage(location)
      }
    })()
  )

  /** wait for all promises to finish */
  return Promise.allSettled(promises)
}

prepack()

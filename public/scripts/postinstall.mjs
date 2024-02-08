import fs from 'fs'
import { exec } from 'child_process'
import Spinnies from 'spinnies'

;(async function main () {
  const tasks = ['tsc --build ./tsconfig.build.json']

  if (!fs.existsSync('tsconfig.build.json')) {
    tasks.unshift(...[
      'ts-patch install -s',
      'lerna run compile --concurrency 2 --parallel --include-dependencies --scope=@dumlj/tidy-cli',
      'dumlj concurrently "tscfg --exclude "**/__template__" --exclude "**/__example__"" "deps --exclude "**/__template__" --exclude "**/__example__""',
      'npm run compile',
      // must compile create-cli
      'dumlj install husky',
    ])
  }

  const spinnies = new Spinnies()
  tasks.forEach((command) => spinnies.add(command, { text: command }))

  while (tasks.length > 0) {
    const command = tasks.shift()
    try {
      await new Promise((resolve, reject) => {
        const cp = exec(command, {
          stdio: 'inherit',
          env: {
            ...process.env,
            FORCE_COLOR: true
          }
        })

        cp.stdout.pipe(process.stdout)
        cp.stderr.pipe(process.stderr)
        cp.on('exit', (code) => code ? reject(code) : resolve())
      })
    } catch (error) {
      spinnies.stopAll('fail')
      return
    }
  
    spinnies.succeed(command)
  }
})()

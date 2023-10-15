import chalk from 'chalk'

export interface PressAnyToContinueConfig {
  message: string
  suffix?: string
}

const DEFAULT_MESSAGE = 'Do you want to continue?'
const DEFAULT_SUFFIX = chalk.gray(`Press ${chalk.white('ANY KEY')} to continue or double press ${chalk.white('Ctrl + C')} to exit.`)

export const pressAnyToContinue = (config: PressAnyToContinueConfig) => {
  const { message = DEFAULT_MESSAGE, suffix = DEFAULT_SUFFIX } = config || {}

  return new Promise<void>((resolve) => {
    /* eslint-disable-next-line no-console */
    console.log(`${chalk.whiteBright(message)}\n\n${suffix}`)

    process.stdin.setRawMode(true)
    process.stdin.resume()

    process.stdin.once('data', (data) => {
      if (data.toString() === '\u0003') {
        process.exit(0)
      }

      process.stdin.setRawMode(false)
      resolve()
    })
  })
}

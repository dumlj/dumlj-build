import chalk from 'chalk'
import { usePrefix, createPrompt, useKeypress } from '@inquirer/core'

export interface PressAnyToContinueConfig {
  message: string
  suffix?: string
}

export const pressAnyToContinue = createPrompt<boolean, PressAnyToContinueConfig>((config, done) => {
  const prefix = usePrefix()
  const { message = 'Do you want to continue?', suffix = chalk.gray(`Press ${chalk.white('ANY KEY')} to continue or double press ${chalk.white('Ctrl + C')} to exit`) } = config

  useKeypress((event) => {
    if (event.ctrl) {
      return
    }

    done(true)
  })

  return `${prefix} ${message}\n\n${suffix}`
})

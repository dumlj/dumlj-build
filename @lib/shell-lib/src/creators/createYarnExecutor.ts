import commandExists from 'command-exists'
import { createExecutor } from './createExecutor'

export const createYarnExecutor = createExecutor((execute) => {
  if (commandExists('yarn')) {
    return execute()
  }
})

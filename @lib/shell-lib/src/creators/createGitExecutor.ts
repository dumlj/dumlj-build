import commandExists from 'command-exists'
import { createExecutor } from './createExecutor'

export const createGitExecutor = createExecutor((execute) => {
  if (commandExists('git')) {
    return execute()
  }
})

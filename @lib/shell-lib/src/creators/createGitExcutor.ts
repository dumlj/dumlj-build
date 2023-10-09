import commandExists from 'command-exists'
import { createExcutor } from './createExcutor'

export const createGitExcutor = createExcutor((execute) => {
  if (commandExists('git')) {
    return execute()
  }
})

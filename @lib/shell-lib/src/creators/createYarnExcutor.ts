import commandExists from 'command-exists'
import { createExcutor } from './createExcutor'

export const createYarnExcutor = createExcutor((execute) => {
  if (commandExists('yarn')) {
    return execute()
  }
})

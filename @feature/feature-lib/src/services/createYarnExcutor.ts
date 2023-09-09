import commandExists from 'command-exists'
import { createExcutor } from './createExcutor'

export const createYarnExcutor = createExcutor((excute) => {
  if (commandExists('yarn')) {
    return excute()
  }
})

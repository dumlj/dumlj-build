import { createGitExcutor } from '../creators/createGitExcutor'

const command = (file: string | string[]) => `git check-ignore ${Array.isArray(file) ? file.join(' ') : file}`

/** 判断文件是否忽略 */
export const gitDetectIgnore = createGitExcutor(command, (content) => {
  return content.split('\n')
})

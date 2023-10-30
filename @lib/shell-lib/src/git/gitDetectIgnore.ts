import { createGitExecutor } from '../creators/createGitExecutor'

const command = (file: string | string[]) => `git check-ignore ${Array.isArray(file) ? file.join(' ') : file}`

/** 判断文件是否忽略 */
export const gitDetectIgnore = createGitExecutor(command, (content) => {
  return content.split('\n')
})

import { createGitExcutor } from '../creators/createGitExcutor'

const command = (file: string) => `git check-ignore ${file}`

/** 文件是否在忽略列表 */
export const gitDetectIgnore = createGitExcutor(command, (content) => {
  return !!content
})

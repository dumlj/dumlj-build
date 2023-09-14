import { createGitExcutor } from '../creators/createGitExcutor'

const command = () => `git status -s`

/** 获取变更的文件列表 */
export const gitChangedFiles = createGitExcutor(command, (stdout) => {
  return stdout
    ?.trim()
    ?.split('\n')
    ?.flatMap((name) => name.trim().replace(/^([\w\?]+?) /, ''))
})

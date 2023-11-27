import { createGitExecutor } from '../creators/createGitExecutor'

const command = () => `git status -s`

/** 获取变更的文件列表 */
export const gitChangedFiles = createGitExecutor(command, (stdout) => {
  return stdout
    ?.trim()
    ?.split('\n')
    ?.flatMap((name) => name.trim().replace(/^([\w\?]+?) /, ''))
})

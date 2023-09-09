import { getGitRepoUrl } from '@/shell/git/gitRepoUrl'
import crypto from 'crypto'
import { createGitExcutor } from '../../creators/createGitExcutor'

const command = () => 'git remote -v'

/** 克隆项目 */
export const gitRepoHash = createGitExcutor(command, (remotes) => {
  const registry = getGitRepoUrl(remotes)
  return crypto.createHash('md5').update(registry).digest('hex').substring(0, 6)
})

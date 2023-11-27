import { createGitExecutor } from '../creators/createGitExecutor'
import { getGitRepoUrl } from '../git/gitRepoUrl'
import crypto from 'crypto'

const command = () => 'git remote -v'

/** 克隆项目 */
export const gitRepoHash = createGitExecutor(command, (remotes) => {
  const registry = getGitRepoUrl(remotes)
  return crypto.createHash('md5').update(registry).digest('hex').substring(0, 6)
})

import { createGitExecutor } from '../creators/createGitExecutor'

const command = () => `git remote -v`

export const getGitRepoUrl = (remotes: string) => {
  const [fetch] = remotes.split('\n')
  const [, url] = fetch.split(/\s+/)
  return url
}

export const gitRepoUrl = createGitExecutor(command, getGitRepoUrl)

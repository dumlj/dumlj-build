import { createGitExcutor } from '../../services/createGitExcutor'

const command = () => `git remote -v`

export const getGitRepoUrl = (remotes: string) => {
  const [fetch] = remotes.split('\n')
  const [, url] = fetch.split(/\s+/)
  return url
}

export const gitRepoUrl = createGitExcutor(command, getGitRepoUrl)

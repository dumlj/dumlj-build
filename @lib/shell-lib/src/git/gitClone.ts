import { createGitExcutor } from '@/creators/createGitExcutor'

export interface GitCloneOptions {
  url: string
  dist: string
}

const command = ({ url, dist }: GitCloneOptions) => `git clone ${url} ${dist}`

/** 获取 Commit 哈希 */
export const gitClone = createGitExcutor(command)

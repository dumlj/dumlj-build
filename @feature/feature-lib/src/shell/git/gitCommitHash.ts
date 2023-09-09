import { createGitExcutor } from '../../services/createGitExcutor'

const command = () => 'git rev-parse --short HEAD'

/** 获取 Commit 哈希 */
export const gitCommitHash = createGitExcutor(command)

import { createGitExecutor } from '../creators/createGitExecutor'

const command = () => 'git rev-parse --short HEAD'

/** 获取 Commit 哈希 */
export const gitCommitHash = createGitExecutor(command)

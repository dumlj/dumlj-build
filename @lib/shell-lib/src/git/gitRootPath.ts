import { createGitExecutor } from '../creators/createGitExecutor'

const command = () => `git rev-parse --show-toplevel`

/** 获取 Git 根目录 */
export const gitRootPath = createGitExecutor(command)

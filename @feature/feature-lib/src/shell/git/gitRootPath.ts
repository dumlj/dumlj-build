import { createGitExcutor } from '../../services/createGitExcutor'

const command = () => `git rev-parse --show-toplevel`

/** 获取 Git 根目录 */
export const gitRootPath = createGitExcutor(command)

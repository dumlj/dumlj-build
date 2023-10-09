import { createYarnExcutor } from '../creators/createYarnExcutor'

const command = () => 'yarn --json workspaces info'

export interface ProjectInWorkspaces {
  location: string
  workspaceDependencies: string[]
  mismatchedWorkspaceDependencies: string[]
}

/** 通过 yarn 获取 workspace 信息 */
export const yarnWorkspaces = createYarnExcutor(command, (stdout) => {
  const response = JSON.parse(stdout)
  const workspaces: Record<string, ProjectInWorkspaces> = JSON.parse(response.data)
  return Object.keys(workspaces).map((name) => ({ name, ...workspaces[name] }))
})

import { createYarnExcutor } from '../../creators/createYarnExcutor'

const command = () => 'yarn --json workspaces info'

/** 获取 workspace 信息 */
export const yarnWorkspaces = createYarnExcutor(command, (stdout) => {
  const response = JSON.parse(stdout)
  const workspaces = JSON.parse(response.data)
  return Object.keys(workspaces).map((name) => ({ name, ...workspaces[name] }))
})

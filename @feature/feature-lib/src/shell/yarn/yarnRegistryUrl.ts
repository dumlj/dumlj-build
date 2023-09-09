import { createYarnExcutor } from '../../services/createYarnExcutor'

const command = () => 'yarn config get registry'

/** 获取项目地址 */
export const yarnRegistryUrl = createYarnExcutor(command)

import { createYarnExecutor } from '../creators/createYarnExecutor'

const command = () => 'yarn config get registry'

/** 获取项目地址 */
export const yarnRegistryUrl = createYarnExecutor(command)

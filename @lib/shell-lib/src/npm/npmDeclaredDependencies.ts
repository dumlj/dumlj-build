import { createCommonExcutor } from '../creators/createCommonExcutor'
import type { NpmLsInfo } from './types'

export interface NpmDeclaredDependenciesResp {
  name: string
  version: string
}

const command = () => `npm ls --json --omit optional --omit peer --depth 0`

/**
 * 获取声明的依赖
 * @description
 * 主要用户获取声明过的依赖，未声明的依赖不会返回
 */
export const npmDeclaredDependencies = createCommonExcutor(command, (stdout) => {
  try {
    const source = stdout.toString().trim()
    const { dependencies }: NpmLsInfo = JSON.parse(source)
    const vers = new Set<string>()
    return Object.keys(dependencies).reduce((result, name) => {
      const { version } = dependencies[name]
      const token = `${name}###${version}`
      if (vers.has(token)) {
        return result
      }

      vers.add(token)
      result.push({ name, version })
      return result
    }, [] as NpmDeclaredDependenciesResp[])
  } catch (error) {
    return []
  }
})

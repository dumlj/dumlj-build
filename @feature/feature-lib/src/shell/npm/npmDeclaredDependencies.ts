import { createCommonExcutor } from '@dumlj/feature-lib'
import type { Package } from '../../typings/package'

const command = () => `npm ls --json --omit optional --omit peer --depth 0`

/**
 * 获取声明的依赖
 * @description
 * 主要用户获取声明过的依赖，未声明的依赖不会返回
 */
export const npmDeclaredDependencies = createCommonExcutor(command, (stdout) => {
  try {
    const source = stdout.toString().trim()
    const { dependencies } = JSON.parse(source) as Package
    return Object.keys(dependencies).map((name) => {
      const { version } = dependencies[name]
      return { name, version }
    })
  } catch (error) {
    return []
  }
})

import { createCommonExecutor } from '../creators/createCommonExecutor'
import type { Dependencies, Package } from '../types'
import { npmDeclaredDependencies } from './npmDeclaredDependencies'

const command = (name: string) => `npm ls "${name}" --json --link --omit optional --omit peer --silent`

const travel = (dependencies: Dependencies, cache: Set<string> = new Set()): Package[] => {
  const resp = Object.keys(dependencies || {}).flatMap((name) => {
    const { version, dependencies: children } = dependencies[name]
    const next = children ? travel(children, cache) : []
    const token = `${name}###${version}`
    if (cache.has(token)) {
      return next
    }

    cache.add(token)
    return [{ name, version }].concat(next)
  })

  return resp.flatMap((item) => item)
}

export const npmDeclaredParents = createCommonExecutor(command, (stdout, { sync }) => {
  const source = stdout.toString().trim()
  const { dependencies } = JSON.parse(source)
  const parents = travel(dependencies)

  if (sync) {
    /** 项目中所有声明的依赖集合 */
    const declares = npmDeclaredDependencies.sync()
    return parents.filter(({ name }) => declares.find((item) => item.name === name))
  }

  return npmDeclaredDependencies().then((declares) => {
    return parents.filter(({ name }) => declares.find((item) => item.name === name))
  })
})

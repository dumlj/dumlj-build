import { mapPathsToOrbitTree, stringifyOrbitTree } from '@dumlj/util-lib'
import type { Context, TreeProject } from '../types'

const stringify = ({ name, internalDependencies }: TreeProject, parent?: string[]): string[][] => {
  const path = parent?.length ? [...parent, name] : [name]
  const dependencies = internalDependencies?.flatMap((project) => stringify(project, path)) || []
  return [path, ...dependencies]
}

export const dependencies = (context: Context) => {
  const { name, repository, dependencies, projects } = context
  const { url, directory } = repository
  const paths = dependencies.flatMap((project) => stringify(project))
  const tree = mapPathsToOrbitTree(paths)
  const messages = stringifyOrbitTree(tree).map(({ orbit, content }) => {
    const name = content.pop()
    const project = projects.find((project) => project.name === name)
    return `${orbit} <a href="${url}/tree/main/${project.location}" target="_blank">${name}</a>`
  })

  const message = [`<a href="${url}/tree/main/${directory}" target="_blank">${name}</a>`].concat(messages).join('\n')
  return `<pre style="font-family:monospace;">${message}</pre>`
}

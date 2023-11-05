import { mapPathsToOrbitTree, stringifyOrbitTree } from '@dumlj/util-lib'
import type { Context, TreeProject } from '../types'

const stringify = ({ name, internalDependencies }: TreeProject, parent?: string[]): string[][] => {
  const path = parent?.length ? [...parent, name] : [name]
  const dependencies = internalDependencies?.flatMap((project) => stringify(project, path)) || []
  return [path, ...dependencies]
}

export const dependencies = (context: Context) => {
  const { repository, dependencies, projects } = context
  const { url, directory } = repository

  const paths = dependencies.flatMap((project) => stringify(project))
  const tree = mapPathsToOrbitTree(paths)

  const messages = stringifyOrbitTree(tree).map(({ orbit, content }) => {
    const name = content.pop()
    const project = projects.find((project) => project.name === name)
    const { isPrivate } = project

    const contentHTML = `[${name}](${url}/tree/main/${directory})`
    const extraHTML = isPrivate ? '<sup><small>PRIVATE</small></sup>' : ''
    const level = Math.ceil(orbit.length / 3) - 1
    return `${' '.repeat(level * 2)}- ${contentHTML}${extraHTML}`
  })

  return messages.join('\n')
}

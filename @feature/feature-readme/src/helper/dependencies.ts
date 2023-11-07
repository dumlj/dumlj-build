import { mapPathsToOrbitTree, stringifyOrbitTree } from '@dumlj/util-lib'
import type { Context, TreeProject } from '../types'

const stringify = ({ name, internalDependencies }: TreeProject, parent?: string[]): string[][] => {
  const path = parent?.length ? [...parent, name] : [name]
  const dependencies = internalDependencies?.flatMap((project) => stringify(project, path)) || []
  return [path, ...dependencies]
}

export const dependencies = (context: Context) => {
  const { name, repository, dependencies, projects } = context
  const { url } = repository

  const paths = dependencies.flatMap((project) => stringify(project))
  const tree = mapPathsToOrbitTree(paths)

  const messages = stringifyOrbitTree(tree).map(({ orbit, content }) => {
    const name = content.pop()
    const project = projects.find((project) => project.name === name)
    const { location, isPrivate } = project

    const contentHTML = `<a href="${url}/tree/main/${location}">${name}</a>`
    const extraHTML = isPrivate ? '<sup><small><i>PRIVATE</i></small></sup>' : ''
    return `${orbit} ${contentHTML}${extraHTML}`
  })

  return `<pre>\n<b>${name}</b>\n${messages.join('\n')}\n</pre>`
}

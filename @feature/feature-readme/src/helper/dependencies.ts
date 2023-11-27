import { mapPathsToOrbitTree, stringifyOrbitTree } from '@dumlj/util-lib'
import type { Context, TreeProject } from '../types'

const stringify = ({ name, internalDependencies }: TreeProject, parent?: string[]): string[][] => {
  const path = parent?.length ? [...parent, name] : [name]
  const dependencies = internalDependencies?.flatMap((project) => stringify(project, path)) || []
  return [path, ...dependencies]
}

export const badgeGithub = (context: Context) => {
  const { repository } = context
  const { url, directory } = repository
  return `[![Github Repo](https://img.shields.io/badge/GITHUB-REPO-0?logo=github)](${url}/tree/main/${directory})`
}

export const badgeMIT = () => {
  return '[![License: MIT](https://img.shields.io/badge/License-MIT-4c1.svg)](https://opensource.org/licenses/MIT)'
}

export const badgeNpmVersion = (context: Context) => {
  const { name } = context
  return `[![NPM Version](https://badge.fury.io/js/${name.replace(/\//g, '%2F')}.svg)](https://www.npmjs.com/package/${name})`
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

    const contentHTML = `<a is="dumlj-link" data-project="${encodeURI(JSON.stringify(project))}" ${url ? `href="${url}/tree/main/${location}"` : ''}>${name}</a>`
    const extraHTML = isPrivate ? '<sup><small><i>PRIVATE</i></small></sup>' : ''
    return `${orbit} ${contentHTML}${extraHTML}`
  })

  return `<pre>\n<b>${name}</b>\n${messages.join('\n')}\n</pre>`
}

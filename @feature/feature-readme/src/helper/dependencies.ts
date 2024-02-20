import { mapPathsToOrbitTree, stringifyOrbitTree } from '@dumlj/util-lib'
import type { Context, TreeProject } from '../types'

const stringify = ({ name, internalDependencies }: TreeProject, parent?: string[]): string[][] => {
  const path = parent?.length ? [...parent, name] : [name]
  const dependencies = internalDependencies?.flatMap((project) => stringify(project, path)) || []
  return [path, ...dependencies]
}

export function badgeGithub(context: Context) {
  const { repository } = context
  if (!repository) {
    return ''
  }

  const { url, directory } = repository
  return `[![Github Repo](https://img.shields.io/badge/GITHUB-REPO-0?logo=github)](${url}/tree/main/${directory})`
}

export function badgeMIT() {
  return '[![License: MIT](https://img.shields.io/badge/License-MIT-4c1.svg)](https://opensource.org/licenses/MIT)'
}

export function badgeNpmVersion(context: Context) {
  const { name } = context
  return `[![NPM Version](https://badge.fury.io/js/${name.replace(/\//g, '%2F')}.svg)](https://www.npmjs.com/package/${name})`
}

const WITHOUT_DEPENDENCE_MESSAGE = 'Without any dependence.'
export function dependencies(context: Context) {
  const { name, repository, dependencies, projects } = context
  if (!Array.isArray(dependencies)) {
    return `<pre>\n<b>${name}</b>\n${WITHOUT_DEPENDENCE_MESSAGE}</pre>`
  }

  const { url } = repository || {}
  const paths = dependencies.flatMap((project) => stringify(project))
  const tree = mapPathsToOrbitTree(paths)!

  const messages = stringifyOrbitTree(tree).map(({ orbit, content }) => {
    const name = content.pop()
    if (!(Array.isArray(projects) && projects.length > 0)) {
      return WITHOUT_DEPENDENCE_MESSAGE
    }

    const project = projects.find((project) => project.name === name)
    if (!project) {
      return WITHOUT_DEPENDENCE_MESSAGE
    }

    const { location, isPrivate } = project
    const contentHTML = `<a is="dumlj-link" data-project="${encodeURI(JSON.stringify(project))}" ${url ? `href="${url}/tree/main/${location}"` : ''}>${name}</a>`
    const extraHTML = isPrivate ? '<sup><small><i>PRIVATE</i></small></sup>' : ''
    return `${orbit} ${contentHTML}${extraHTML}`
  })

  return `<pre>\n<b>${name}</b>\n${messages.join('\n')}\n</pre>`
}

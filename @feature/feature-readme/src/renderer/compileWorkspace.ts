import { findWorkspaceRootPath, findWorkspaceProject, type Project } from '@dumlj/util-lib'
import micromatch from 'micromatch'
import { type Render } from './renderStore'
import { compileProject, type CompileProjectOptions } from './compileProject'
import { type TreeProject } from '../types'

export type Renderer = Render & {
  project: Project
  dependencies: TreeProject[]
}

export interface CompileWorkspaceOptions extends CompileProjectOptions {
  /** node_modules 寻址路径, module.paths */
  paths?: string[]
  /**
   * pattern of filter out included projects
   * @example
   * ['packages/*']
   */
  include?: string | string[]
  /**
   * pattern of filter out excluded projects
   * @example
   * ['__tests__/*']
   */
  exclude?: string | string[]
  /** 多语言 */
  local?: string
}

export async function compileWorkspace(options?: CompileWorkspaceOptions) {
  const { configFile, paths, include: inInclude, exclude: inExclude, local } = options || {}
  const include = Array.isArray(inInclude) ? inInclude : typeof inInclude === 'string' ? [inInclude] : []
  const exclude = Array.isArray(inExclude) ? inExclude : typeof inExclude === 'string' ? [inExclude] : []
  const rootPath = (await findWorkspaceRootPath({ paths })) || process.cwd()
  const projects = (await findWorkspaceProject({ cwd: rootPath })).filter(({ location }) => {
    if (Array.isArray(include) && include.length > 0) {
      return micromatch.isMatch(location, include)
    }

    if (Array.isArray(exclude) && exclude.length > 0) {
      return !micromatch.isMatch(location, exclude)
    }

    return true
  })

  if (projects.length === 0) {
    return new Map()
  }

  const projectMap = new Map<string, TreeProject>(projects.map((project) => [project.name, { ...project, internalDependencies: [] }]))
  const iterator = projectMap.values()
  const treeProjects: TreeProject[] = []
  while (true) {
    const { done, value: project } = iterator.next()
    if (done) {
      break
    }

    const internalDependencies = project.workspaceDependencies.map((name) => projectMap.get(name))
    project.internalDependencies = internalDependencies.filter(Boolean) as TreeProject[]
    treeProjects.push(project)
  }

  const renderers = new Map<string, Renderer>()
  await Promise.all(
    treeProjects.map(async (project) => {
      const { name, location, internalDependencies } = project
      const render = await compileProject(location, { cwd: rootPath, configFile, local })
      if (typeof render !== 'function') {
        return
      }

      const renderWithDependencies = (context?: Record<string, any>) => render({ projects, dependencies: internalDependencies, ...context })
      const renderProject = Object.assign(renderWithDependencies, { project, dependencies: internalDependencies })
      renderers.set(name, renderProject)
    })
  )

  return renderers
}

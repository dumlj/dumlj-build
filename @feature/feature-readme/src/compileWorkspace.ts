import { findWorkspaceRootPath, findWorkspaceProject, type Project } from '@dumlj/util-lib'
import micromatch from 'micromatch'
import { type Render } from './renderStore'
import { compile, type CompileOptions } from './compile'

export type Renderer = Render & {
  project: Project
}

export interface CompileWorkspaceOptions extends CompileOptions {
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
}

export const compileWorkspace = async (options?: CompileWorkspaceOptions) => {
  const { configFile, paths, include: inInclude, exclude: inExclude } = options || {}
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
    return
  }

  const projectMap = new Map(projects.map((project) => [project.name, project]))
  const renderers = new Map<string, Renderer>()
  await Promise.all(
    projects.map(async (project) => {
      const { name, location, workspaceDependencies } = project
      const dependencies = workspaceDependencies.map((name) => {
        const project = projectMap.get(name)
        return project
      })

      const render = await compile(location, { cwd: rootPath, configFile })
      if (typeof render !== 'function') {
        return
      }

      const renderWithDependencies = (context: Record<string, any>) => render({ dependencies, ...context })
      const renderProject = Object.assign(renderWithDependencies, { project, dependencies })
      renderers.set(name, renderProject)
    })
  )

  return renderers
}

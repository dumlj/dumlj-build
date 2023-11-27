import fs from 'fs-extra'
import { glob } from 'glob'
import { uniq } from 'lodash'
import path from 'path'

export interface Project {
  name: string
  version: string
  description: string
  location: string
  dependencies: string[]
  workspaceDependencies: string[]
  isPrivate: boolean
}

export interface ProjectGraph extends Project {
  graph?: ProjectGraph[]
}

const PROJECT_CACHE: Project[] = []

export interface FindWorkspaceProjectOptions {
  /** project pattern in workspace (default get workspace settings from package.json) */
  pattern?: string[]
  /** get datas from cache if projects have been cached (default true) */
  fromCache?: boolean
  /** workspace root path (default process.cwd()) */
  cwd?: string
}

/** find projects from workspace project */
export const findWorkspaceProject = async (options?: FindWorkspaceProjectOptions): Promise<Project[]> => {
  const { pattern, fromCache = true, cwd = process.cwd() } = options || {}
  if (fromCache === true && Array.isArray(PROJECT_CACHE) && PROJECT_CACHE.length > 0) {
    return PROJECT_CACHE
  }

  if (typeof pattern === 'undefined') {
    const source: PackageSource = await fs.readJson(path.join(cwd, 'package.json'))
    const pattern = Array.isArray(source?.workspaces) ? source?.workspaces : source?.workspaces?.packages || []
    return findWorkspaceProject({ pattern, fromCache, cwd })
  }

  const folders = await Promise.all(pattern.map((pattern) => glob(path.join(cwd, pattern), {
    windowsPathsNoEscape: true,
  })))

  const results = await Promise.all(
    folders.flatMap((locations) =>
      locations.map(async (src) => {
        if (!(await fs.stat(src)).isDirectory()) {
          return null
        }

        const pkg = path.join(src, 'package.json')
        if (!(await fs.pathExists(pkg))) {
          return null
        }

        const source: PackageSource = await fs.readJson(pkg)
        const { name, version, description, private: isPrivate = false } = source
        const normalDependencies = Object.keys(source.dependencies || {})
        const devDependencies = Object.keys(source.devDependencies || {})
        const peerDependencies = Object.keys(source.peerDependencies || {})
        const optionalDependencies = Object.keys(source.optionalDependencies || {})
        const bundleDependencies = Object.keys(source.bundleDependencies || {})
        const bundledDependencies = Object.keys(source.bundledDependencies || {})
        const dependencies: string[] = uniq([].concat(normalDependencies, devDependencies, peerDependencies, optionalDependencies, bundleDependencies, bundledDependencies))

        const location = path.relative(cwd, src)
        return { name, version, description, isPrivate, location, dependencies }
      })
    )
  )

  const projects = results.filter(Boolean)

  // 验证 workspace 是否正确
  projects.reduce((checkeds, { name }) => {
    if (checkeds.includes(name)) {
      const locations = projects.filter((project) => project.name === name).map(({ location }) => path.join(path.relative(process.cwd(), location), 'package.json'))
      throw new Error(`The project name ${name} is duplicated in the workspace.${[''].concat(locations).join('\n - ')}`)
    }

    checkeds.push(name)
    return checkeds
  }, [])

  const arranged: Project[] = projects.map((project) => {
    const workspaceDependencies = project.dependencies.filter((name) => -1 !== projects.findIndex((project) => project.name === name))
    return Object.assign(project, { workspaceDependencies })
  })

  PROJECT_CACHE.splice(0, PROJECT_CACHE.length, ...arranged)
  return arranged
}

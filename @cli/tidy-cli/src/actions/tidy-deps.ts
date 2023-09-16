import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import micromatch from 'micromatch'
import { findWorkspaceRootPath } from '@dumlj/util-lib'
import { yarnWorkspaces } from '@dumlj/shell-lib'
import depcheck from 'depcheck'
import { findSiblingsVersion } from '../utils/findSiblingsVersion'
import { info, warn } from '../services/logger'

export interface TidyDepsOptions {
  /** 生产依赖匹配参数 */
  src?: string
  /** 必要依赖 */
  necessary?: string | string[]
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

export const tidyDeps = async (options?: TidyDepsOptions) => {
  const { necessary: inNecessary = ['tslib'], src: srcPattern = 'src/**', paths = [...module.paths], include: inInclude, exclude: inExclude } = options
  const include = Array.isArray(inInclude) ? inInclude : typeof inInclude === 'string' ? [inInclude] : []
  const exclude = Array.isArray(inExclude) ? inExclude : typeof inExclude === 'string' ? [inExclude] : []
  const necessary = Array.isArray(inNecessary) ? inNecessary : inNecessary.split(',')
  const rootPath = await findWorkspaceRootPath({ paths })
  const workspaces = (await yarnWorkspaces()).filter(({ location }) => {
    if (Array.isArray(include) && include.length > 0) {
      return micromatch.isMatch(location, include)
    }

    if (Array.isArray(exclude) && exclude.length > 0) {
      return !micromatch.isMatch(location, exclude)
    }

    return true
  })

  await Promise.all(
    workspaces.map(async ({ location }) => {
      const absPath = path.join(rootPath, location)
      const { missing, using } = await depcheck(absPath, {
        ignoreBinPackage: false,
        skipMissing: false,
        ignorePatterns: ['libs', 'node_modules'],
      })

      const dependencies: Record<string, string> = {}
      const devDependencies: Record<string, string> = {}
      await Promise.all(
        Object.keys(missing).map(async (name) => {
          const version = await findSiblingsVersion(name)
          const isDev = !missing[name].find((file) => {
            const relativePath = path.relative(absPath, file)
            return micromatch.isMatch(relativePath, srcPattern)
          })

          isDev ? (devDependencies[name] = `^${version}`) : (dependencies[name] = `^${version}`)
        })
      )

      const pkgJson = path.join(absPath, 'package.json')
      const source: PackageSource = await fs.readJson(pkgJson)

      const missDependencies = Object.keys(dependencies).length > 0
      const missDevDependencies = Object.keys(devDependencies).length > 0

      if (missDependencies) {
        source.dependencies = {
          ...source?.dependencies,
          ...dependencies,
        }
      }

      if (missDevDependencies) {
        source.devDependencies = {
          ...source?.devDependencies,
          ...devDependencies,
        }
      }

      await fs.writeFile(pkgJson, JSON.stringify(source, null, 2))

      if (missDependencies) {
        const versions = Object.keys(dependencies).map((name) => `${name}@${dependencies[name]}`)
        info(`The following dependencies have been ${chalk.bold('added')} to ${path.relative(rootPath, pkgJson)}.\n - ${versions.join('\n - ')}\n`)
      }

      if (missDevDependencies) {
        const versions = Object.keys(devDependencies).map((name) => `${name}@${devDependencies[name]}`)
        info(`The following devDependencies have been ${chalk.bold('added')} to ${path.relative(rootPath, pkgJson)}.\n - ${versions.join('\n - ')}\n`)
      }

      const uselessDependencies: Record<string, string> = {}
      const uselessDevDependencies: Record<string, string> = {}

      Object.keys(source?.dependencies || []).forEach((name) => {
        if (!(name in using || necessary.includes(name))) {
          uselessDependencies[name] = source.dependencies[name]
        }
      })

      Object.keys(source?.devDependencies || []).forEach((name) => {
        if (!(name in using || necessary.includes(name))) {
          uselessDevDependencies[name] = source.devDependencies[name]
        }
      })

      const hasUselessDependencies = Object.keys(uselessDependencies).length > 0
      const hasUselessDevDependencies = Object.keys(uselessDevDependencies).length > 0

      if (hasUselessDependencies) {
        const versions = Object.keys(uselessDependencies).map((name) => `${name}@${uselessDependencies[name]}`)
        warn(`The following dependencies useless and should be ${chalk.bold('removed')} from ${path.relative(rootPath, pkgJson)}.\n - ${versions.join('\n - ')}\n`)
      }

      if (hasUselessDevDependencies) {
        const versions = Object.keys(uselessDevDependencies).map((name) => `${name}@${uselessDevDependencies[name]}`)
        warn(`The following devDependencies are useless and should be ${chalk.bold('removed')} from ${path.relative(rootPath, pkgJson)}.\n - ${versions.join('\n - ')}\n`)
      }
    })
  )
}

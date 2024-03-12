import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import micromatch from 'micromatch'
import { resolveOptions, ok, info, warn } from '@dumlj/seed-cli'
import { findWorkspaceRootPath, findWorkspaceProject } from '@dumlj/util-lib'
import depcheck from 'depcheck'
import { findSiblingsVersion } from '../utils/findSiblingsVersion'

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
  /** ignore check files */
  ignore?: string | string[]
}

export async function tidyDeps(options?: TidyDepsOptions) {
  const {
    necessary: inNecessary = ['tslib', 'webpack-cli'],
    src: srcPattern = 'src/**',
    paths = [...module.paths],
    include: inInclude,
    exclude: inExclude,
    ignore: inIgnore,
  } = options || {}

  const include = Array.isArray(inInclude) ? inInclude : typeof inInclude === 'string' ? [inInclude] : []
  const exclude = Array.isArray(inExclude) ? inExclude : typeof inExclude === 'string' ? [inExclude] : []
  const ignore = Array.isArray(inIgnore) ? inIgnore : typeof inIgnore === 'string' ? [inIgnore] : []
  const necessary = Array.isArray(inNecessary) ? inNecessary : inNecessary.split(',')
  const rootPath = (await findWorkspaceRootPath({ paths })) || process.cwd()
  const workspaces = (await findWorkspaceProject()).filter(({ location }) => {
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
      const config = await resolveOptions<TidyDepsOptions>('tidy', absPath)
      /**
       * Note that in TS
       * the forced type `<Type>` will cause the failure to parse,
       * because of the conflict with tsx
       */
      const { missing, using } = await depcheck(absPath, {
        ignoreBinPackage: false,
        skipMissing: false,
        ignoreMatches: config?.ignore as ReadonlyArray<string>,
        ignorePatterns: ['/libs', '/build', 'node_modules'].concat(ignore, config?.ignore || []),
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

          isDev ? (devDependencies[name] = `^${version}`.trimEnd()) : (dependencies[name] = `^${version}`.trimEnd())
        })
      )

      const pkgJson = path.join(absPath, 'package.json')
      const source: PackageSource = await fs.readJson(pkgJson)
      const missDependencies = Object.keys(dependencies).length > 0
      const missDevDependencies = Object.keys(devDependencies).length > 0

      if (missDependencies) {
        source.dependencies = {
          ...source.dependencies,
          ...dependencies,
        }
      }

      if (missDevDependencies) {
        source.devDependencies = {
          ...source.devDependencies,
          ...devDependencies,
        }
      }

      /**
       * @todo
       * 这里涉及写文件
       * 若出现同时读写的情况，而会导致 package.json 无法读取
       */

      if (missDependencies || missDevDependencies) {
        const content = JSON.stringify(source, null, 2)
        await fs.writeFile(pkgJson, content)
      }

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
      Object.entries({ ...source.dependencies }).forEach(([name, version]) => {
        if (!(name in using || necessary.includes(name) || config?.ignore?.includes(name))) {
          uselessDependencies[name] = version
        }
      })

      Object.entries({ ...source.devDependencies }).forEach(([name, version]) => {
        if (!(name in using || necessary.includes(name) || config?.ignore?.includes(name))) {
          uselessDevDependencies[name] = version
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

  ok('Analysis of project dependencies completed.')
}

import fs from 'fs-extra'
import path from 'path'
import micromatch from 'micromatch'
import { findWorkspaceRootPath } from '@dumlj/util-lib'
import { yarnWorkspaces } from '@dumlj/shell-lib'
import depcheck from 'depcheck'
import { findSiblingsVersion } from '../utils/findSiblingsVersion'
import { info } from '../services/logger'

export interface TidyDepsOptions {
  /** 必要依赖 */
  dependencies?: string[]
}

export const tidyDeps = async (options?: TidyDepsOptions) => {
  const { dependencies: depPattern = ['src/**'] } = options
  const rootPath = await findWorkspaceRootPath()
  const workspaces = await yarnWorkspaces()

  await Promise.all(
    workspaces.map(async ({ location }) => {
      const absPath = path.join(rootPath, location)
      const { missing } = await depcheck(absPath, {
        ignoreBinPackage: false,
        skipMissing: false,
        ignorePatterns: ['libs', 'node_modules'],
      })

      const dependencies: Record<string, string> = {}
      const devDependencies: Record<string, string> = {}
      await Promise.all(
        Object.keys(missing).map(async (name) => {
          const version = await findSiblingsVersion(name)
          const isDev =
            -1 ===
            missing[name].findIndex((file) => {
              const relativePath = path.relative(absPath, file)
              return micromatch.isMatch(relativePath, depPattern)
            })

          isDev ? (devDependencies[name] = `^${version}`) : (dependencies[name] = `^${version}`)
        })
      )

      const missDependencies = Object.keys(dependencies).length > 0
      const missDevDependencies = Object.keys(devDependencies).length > 0
      if (missDependencies || missDevDependencies) {
        const pkgJson = path.join(absPath, 'package.json')
        const source: PackageSource = await fs.readJson(pkgJson)

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
          info(`The following dependencies have been added to ${path.relative(rootPath, pkgJson)}.\n - ${versions.join('\n - ')}\n`)
        }

        if (missDevDependencies) {
          const versions = Object.keys(devDependencies).map((name) => `${name}@${devDependencies[name]}`)
          info(`The following devDependencies have been added to ${path.relative(rootPath, pkgJson)}.\n - ${versions.join('\n - ')}\n`)
        }
      }
    })
  )
}

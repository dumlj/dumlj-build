import { yarnWorkspaces } from '@dumlj/shell-lib'
import { findWorkspaceRootPath } from '@dumlj/util-lib'
import chalk from 'chalk'
import isEqual from 'lodash/isEqual'
import path from 'path'
import fs from 'fs-extra'
import micromatch from 'micromatch'
import { ok, info } from '../services/logger'

export interface TidyTscfgOptions {
  /** basic tsconfig file in each project */
  tsconfig?: string
  /** name of tsconfig output */
  output?: string
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

export const tidyTscfg = async (options?: TidyTscfgOptions) => {
  const { tsconfig = './tsconfig.compile.json', output = 'tsconfig.build.json', paths, include: inInclude, exclude: inExclude } = options || {}
  const include = Array.isArray(inInclude) ? inInclude : typeof inInclude === 'string' ? [inInclude] : []
  const exclude = Array.isArray(inExclude) ? inExclude : typeof inExclude === 'string' ? [inExclude] : []

  /** root path in workspaces */
  const rootPath = (await findWorkspaceRootPath({ paths })) || process.cwd()
  const workspaces = (await yarnWorkspaces()).filter(({ location }) => {
    if (Array.isArray(include) && include.length > 0) {
      return micromatch.isMatch(location, include)
    }

    if (Array.isArray(exclude) && exclude.length > 0) {
      return !micromatch.isMatch(location, exclude)
    }

    return true
  })

  const updates: string[] = []
  const created: string[] = []

  const whiteTsConfig = async (file: string, config: Record<string, any>) => {
    if (await fs.pathExists(file)) {
      const prevSource = await fs.readJson(file)
      if (!isEqual(prevSource, config)) {
        await fs.writeFile(file, JSON.stringify(config, null, 2))
        updates.push(path.relative(rootPath, file))
      }
    } else {
      await fs.writeFile(file, JSON.stringify(config, null, 2))
      created.push(path.relative(rootPath, file))
    }
  }

  const rootReferences = await Promise.all(
    workspaces.map(async ({ location, workspaceDependencies }) => {
      const absPath = path.join(rootPath, location)
      /** tsconfig.references */
      const references = workspaceDependencies.map((name) => {
        const { location } = workspaces.find((item) => item.name === name)
        /** 依赖路径 */
        const depAbsPath = path.join(rootPath, location)
        /**
         * 依赖配置文件的相对路径
         * @example
         * {"references": [{ "path": "../a/tsconfig.json" }]}
         */
        const relativePath = path.relative(absPath, depAbsPath)
        return { path: path.join(relativePath, output) }
      })

      const configFile = path.join(absPath, tsconfig)
      const source = await fs.readJson(configFile)
      const { compilerOptions = {} } = source || {}

      const file = path.join(absPath, output)
      const content = {
        extends: tsconfig,
        compilerOptions: {
          ...compilerOptions,
          composite: true,
        },
        references,
      }

      await whiteTsConfig(file, content)
      return { path: `.${path.sep}${path.join(location, output)}` }
    })
  )

  const file = path.join(rootPath, output)
  const content = {
    exclude: ['**'],
    references: rootReferences,
  }

  await whiteTsConfig(file, content)

  if (created.length > 0) {
    info(`The following ${chalk.bold(output)} file has been generated, please add file to .gitignore.\n - ${created.join('\n - ')}\n`)
  }

  if (updates.length > 0) {
    info(`The following ${chalk.bold(output)} file has been updated.\n - ${updates.join('\n - ')}\n`)
  }

  ok('Generate tsconfig files for project build completed.')
}

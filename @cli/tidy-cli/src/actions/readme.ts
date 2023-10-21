import { findWorkspaceRootPath } from '@dumlj/util-lib'
import { compileWorkspace, type CompileWorkspaceOptions, type ReadmeConfiguration } from '@dumlj/feature-readme'
import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import { ok, info, warn } from '../services/logger'

export type { ReadmeConfiguration }

export interface TidyReadmeOptions extends Omit<CompileWorkspaceOptions, 'configFile'> {
  /** name of config file */
  config?: string
  /** 输出文件 */
  output?: string
}

export const tidyReadme = async (options?: TidyReadmeOptions) => {
  const { output = 'README.md', config: configFile, template, cwd: inCwd, banner, include, exclude, paths } = options
  const cwd = typeof inCwd === 'string' ? inCwd : (await findWorkspaceRootPath({ paths })) || process.cwd()
  const renderers = await compileWorkspace({ configFile, template, cwd, banner, include, exclude, paths })
  if (!(renderers && renderers.size > 0)) {
    warn('No projects found.')
    return
  }

  // 渲染
  /** 结果 */
  const stats = await Promise.all(
    Array.from(renderers.values()).map(async (render) => {
      const { project } = render
      const { location } = project
      const file = path.join(cwd, location, output)
      const content = render()
      await fs.writeFile(file, content)
      return { file, location }
    })
  )

  const message = [''].concat(stats.map(({ location }) => path.join(location, output))).join('\n - ')
  info(`The following ${chalk.bold(output)} have been ${chalk.bold('generated')}.${message}`)
  ok('Generate readme files completed.')
}

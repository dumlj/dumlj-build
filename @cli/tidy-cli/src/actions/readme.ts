import { findWorkspaceRootPath } from '@dumlj/util-lib'
import { compileWorkspace, resolveConfig, type Renderer, type CompileWorkspaceOptions } from '@dumlj/feature-readme'
import { ok, info, warn } from '@dumlj/seed-cli'
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'

export interface TidyReadmeOptions extends Omit<CompileWorkspaceOptions, 'configFile'> {
  /** name of config file */
  config?: string
  /** 输出文件 */
  output?: string
  /** 多语言 */
  locals?: string[]
}

export const tidyReadme = async (options?: TidyReadmeOptions) => {
  const { locals: inLocals = [], output = 'README.md', config: configFile, template, cwd: inCwd, banner, include, exclude, paths } = options || {}
  const cwd = typeof inCwd === 'string' ? inCwd : (await findWorkspaceRootPath({ paths })) || process.cwd()
  const { locals = inLocals } = await resolveConfig<{ locals: string[] }>({ cwd, configFile })
  const buildRender = async (local?: string) => {
    const renderers = await compileWorkspace({ local, configFile, template, cwd, banner, include, exclude, paths })
    return Array.from(renderers.values())
  }

  const render = (renderers: Renderer[], local?: string) => {
    const ext = path.extname(output)
    const outputFile = local ? output.replace(ext, `.${local}${ext}`) : output
    const promises = renderers.map(async (render) => {
      const { project } = render
      const { location } = project
      const file = path.join(cwd, location, outputFile)
      const content = render()
      await fs.promises.writeFile(file, content)
      return { file, location }
    })

    return Promise.all(promises)
  }

  const renderers = await buildRender()
  if (!(renderers && renderers.length > 0)) {
    warn('No projects found.')
    return
  }

  // 渲染
  /** 结果 */
  const defaultStats = await render(renderers)
  const localStats: { file: string; location: string }[] = []

  await Promise.all(
    locals.map(async (local) => {
      const renderers = await buildRender(local)
      if (!(renderers && renderers.length > 0)) {
        return
      }

      const stats = await render(renderers, local)
      localStats.push(...stats)
    })
  )

  const stats = [...defaultStats, ...localStats]
  const message = [''].concat(stats.map(({ file }) => path.relative(cwd, file))).join('\n - ')
  info(`The following ${chalk.bold(output)} have been ${chalk.bold('generated')}.${message}`)
  ok('Generate readme files completed.')
}

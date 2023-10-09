import { gitContributors, gitRepoUrl, yarnWorkspaces } from '@dumlj/shell-lib'
import { findWorkspaceRootPath } from '@dumlj/util-lib'
import { prepare } from '@dumlj/feature-prepare'
import { startCase } from 'lodash'
import fs from 'fs-extra'
import path from 'path'
import micromatch from 'micromatch'
import chalk from 'chalk'
import { DEFAULT_PARTS, DEFAULT_TEMPLATE_FILE_NAME, DEFAULT_CONFIG_FILE_NAME, DEFAULT_OUTPUT } from './constants'
import { compile } from './compile'
import { ok, info, fail } from '../../services/logger'
import type { ReadmeConfiguration } from './types'

export type { ReadmeConfiguration }

export interface TidyReadmeOptions {
  /** name of config file */
  config?: string
  /** 输出文件 */
  output?: string
  /** template parts of readme */
  template?: string
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
  /** 根路径 */
  rootPath?: string
}

export const tidyReadme = async (options?: TidyReadmeOptions) => {
  const {
    config = DEFAULT_CONFIG_FILE_NAME,
    output: inOutput = DEFAULT_OUTPUT,
    template: inTemplate = DEFAULT_TEMPLATE_FILE_NAME,
    paths,
    include: inInclude,
    exclude: inExclude,
  } = options || {}

  const include = Array.isArray(inInclude) ? inInclude : typeof inInclude === 'string' ? [inInclude] : []
  const exclude = Array.isArray(inExclude) ? inExclude : typeof inExclude === 'string' ? [inExclude] : []
  const rootPath = (await findWorkspaceRootPath({ paths })) || process.cwd()

  const rcFile = path.join(rootPath, config)
  const {
    parts = DEFAULT_PARTS,
    template,
    output,
    helpers,
    metadatas: metadatasResolvers,
  } = await (async () => {
    if (await fs.pathExists(rcFile)) {
      const { configure } = await prepare<{ configure: ReadmeConfiguration }>(rcFile)
      const { parts, template = inTemplate, output = inOutput, helpers, metadatas } = (await configure()) || {}
      return { parts, template, output, helpers, metadatas }
    }

    return { template: inTemplate, output: inOutput }
  })()

  const workspaces = (await yarnWorkspaces()).filter(({ location }) => {
    if (Array.isArray(include) && include.length > 0) {
      return micromatch.isMatch(location, include)
    }

    if (Array.isArray(exclude) && exclude.length > 0) {
      return !micromatch.isMatch(location, exclude)
    }

    return true
  })

  /** 查找可用 readmes */
  const findReadmes = () =>
    workspaces.map(async ({ name, location }) => {
      const paths = []
      /** 文件夹 */
      let current = path.join(rootPath, location)
      while (true) {
        const target = path.join(current, template)
        if (await fs.pathExists(target)) {
          paths.push(target)
        }

        if (current === rootPath || ['.', '/'].includes(current)) {
          break
        }

        current = path.dirname(current)
      }

      if (!(paths.length > 0)) {
        return
      }

      return { name, location, paths }
    })

  const readmes = (await Promise.all(findReadmes())).filter(Boolean)
  if (readmes.length === 0) {
    return
  }

  /**
   * 根据 readme 模板转换成渲染函数
   * @description
   * 转换函数主要为了避免在不需要转换的情况下
   * 读取渲染数据。
   */
  const makeRenders = () =>
    readmes.map(async ({ name, location, paths }) => {
      const renders = await compile({ files: parts.map((file) => `${file}.md`), lookupPaths: paths })
      if (renders.length === 0) {
        return
      }

      const pkgJson = path.join(rootPath, location, 'package.json')
      const source = await fs.readFile(pkgJson, { encoding: 'utf-8' })
      return async (context: Record<string, any> = {}) => {
        const alias = startCase(name.split('/').pop())
        const { description } = (() => {
          try {
            return JSON.parse(source)
          } catch (error) {
            fail(error)
          }

          return { description: '' }
        })()

        const codes = renders.map((render) => render({ name, alias, description, location, ...context }, { helpers }))
        const file = path.join(rootPath, location, output)

        const content = [`<!-- This file is dynamically generated. please edit in ${template} -->`].concat(codes).join('\n\n')
        await fs.writeFile(file, content)
        return { file, location }
      }
    })

  // 渲染函数
  const renders = (await Promise.all(makeRenders())).filter(Boolean)
  if (renders.length === 0) {
    return
  }

  // 获取渲染数据
  const [repository, contributors] = await Promise.all([gitRepoUrl(), gitContributors()])

  /** 额外数据 */
  const metadatas: Record<string, any> = {}
  if (typeof metadatasResolvers === 'object' && metadatasResolvers !== null) {
    for (const [name, fn] of Object.entries(metadatasResolvers)) {
      if (typeof fn === 'function') {
        metadatas[name] = await fn()
        continue
      }

      metadatas[name] = fn
    }
  }

  // 渲染
  /** 结果 */
  const stats = await Promise.all(renders.map((render) => render({ ...metadatas, repository, contributors })))
  const message = [''].concat(stats.map(({ location }) => path.join(location, output))).join('\n - ')
  info(`The following ${chalk.bold(output)} have been ${chalk.bold('generated')}.${message}`)

  ok('Generate readme files completed.')
}

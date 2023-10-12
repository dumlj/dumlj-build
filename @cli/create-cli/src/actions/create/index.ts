import { ok } from '@dumlj/feature-pretty'
import { prepare } from '@dumlj/feature-prepare'
import { gitDetectIgnore, yarnWorkspaces } from '@dumlj/shell-lib'
import { findWorkspaceRootPath } from '@dumlj/util-lib'
import chalk from 'chalk'
import trimEnd from 'lodash/trimEnd'
import kebabCase from 'lodash/kebabCase'
import fs from 'fs-extra'
import path from 'path'
import { glob } from 'glob'
import inquirer, { type ChoiceCollection } from 'inquirer'
import { Project } from 'ts-morph'
import { DEFAULT_TEMPLATE_PATTERN, DEFAULT_RC_FILE } from './constants'
import type { TemplateSchema } from './types'

export interface CreateProjectOptions {
  /** pattern of template name in project */
  pattern?: string
  /** name of config file */
  rc?: string
}

export const createProject = async (options?: CreateProjectOptions) => {
  const { pattern = DEFAULT_TEMPLATE_PATTERN, rc: configFile = DEFAULT_RC_FILE } = options || {}
  const rootPath = await findWorkspaceRootPath()
  const workspaces = await yarnWorkspaces()
  const templates = workspaces.filter(({ name }) => new RegExp(`^${pattern}`).test(name))
  const choices: ChoiceCollection = await Promise.all(
    templates.map(async ({ location }) => {
      const config = path.join(rootPath, location, configFile)
      if (!(await fs.pathExists(config))) {
        return
      }

      const { configure } = await prepare<{ configure: () => Promise<TemplateSchema> }>(config)
      const schema = await configure()
      const { name: sName, description } = await configure()
      const name = `${sName} - ${description}`
      const value = { ...schema, src: path.dirname(config) }
      return { name, value }
    })
  )

  interface Resp {
    name: string
    description: string
    template: TemplateSchema & { src: string }
  }

  const {
    name: alias,
    description,
    template,
  } = await inquirer.prompt<Resp>([
    {
      type: 'list',
      name: 'template',
      message: 'please select a template type for initialization.',
      choices: choices.filter(Boolean),
    },
    {
      type: 'input',
      name: 'name',
      message: `please input a name for this module.`,
      suffix: chalk.grey(`(e.g.CustomWebpackPlugin)`),
      async validate(name, { template }) {
        const { outputPathResolver } = template
        const folder = path.join(rootPath, outputPathResolver(kebabCase(name)))
        if (await fs.pathExists(folder)) {
          return new Error('name is exists')
        }

        const MIN_SIZE = 4
        const MAX_SIZE = 30

        // 必填
        if (!name) {
          return new Error('name is required.')
        }

        // 最小长度
        if (name.length < MIN_SIZE) {
          return new Error('name must be more than 4 characters.')
        }

        // 最大长度
        if (name.length > MAX_SIZE) {
          return new Error('name must be less than 10 characters.')
        }

        // 必须为英文
        if (!/^([a-zA-Z]+?)$/.test(name)) {
          return new Error('name can only be in English letters.')
        }

        return true
      },
      transformer(input, { template }) {
        const { nameTransform } = template
        if (typeof nameTransform === 'function') {
          const { name, same, suffix } = nameTransform(input)
          return name.replace(same, ($1) => chalk.cyan($1)).replace(suffix, ($1) => chalk.gray($1))
        }

        return name
      },
    },
    {
      type: 'input',
      name: 'description',
      message: 'please input a description for this module.',
      validate(description) {
        const MIN_SIZE = 3
        const MAX_SIZE = 100

        // 必填
        if (!description) {
          return new Error('description is required.')
        }

        // 最小长度
        if (description.length < MIN_SIZE) {
          return new Error('description must be more than 4 characters.')
        }

        // 最大长度
        if (description.length > MAX_SIZE) {
          return new Error('description must be less than 10 characters.')
        }

        return true
      },
    },
  ])

  const { src, nameTransform, outputPathResolver, pkgTransform, tsTransform } = template
  const { shortName: name } = nameTransform(alias)

  /** 输出路径 */
  const output = outputPathResolver(kebabCase(name))
  const dist = path.join(rootPath, output)
  const files = await glob('**/*', { cwd: src, nodir: true, ignore: [configFile] })
  const ignores = await gitDetectIgnore(files)
  /**
   * 没被忽略的文件
   * @description
   * 若项目不是 git 项目，gitDetectIgnore 会返回 undefined
   */
  const noIgnores = Array.isArray(ignores) ? files.filter((file) => !ignores.includes(file)) : files
  const project = new Project({
    /** @todo 格式化无效 */
    // manipulationSettings: {
    //   quoteKind: QuoteKind.Single,
    //   indentationText: IndentationText.TwoSpaces,
    //   useTrailingCommas: true,
    // }
  })

  await Promise.all(
    noIgnores.map(async (file) => {
      const srcFile = path.join(src, file)
      const tranform = async () => {
        if (file === 'package.json') {
          const source = await fs.readJson(srcFile)
          const { output = file } = (await pkgTransform({ name, description, file, source })) || {}
          const outputFile = path.join(dist, output)
          const code = JSON.stringify(source, null, 2)
          return { file: outputFile, code }
        }

        switch (path.extname(file)) {
          case '.ts': {
            const content = await fs.readFile(srcFile, { encoding: 'utf-8' })
            const ast = project.createSourceFile(path.join(dist, file), content)
            const { output = file } = (await tsTransform({ name, description, file, ast })) || {}

            /** @todo 格式化无效 */
            // ast.formatText()

            const code = ast.print()
            const outputFile = path.join(dist, output)
            return { file: outputFile, code }
          }
        }
      }

      const outFile = path.join(dist, file)
      const { file: output = outFile, code } = (await tranform()) || {}
      await fs.ensureDir(path.dirname(output))

      try {
        if (!code) {
          await fs.copyFile(srcFile, output)
          return
        }

        await fs.writeFile(output, code)
      } catch (error) {
        fail(error)
      }
    })
  )

  const stats = [
    ['name', name],
    ['description', description],
    ['template', template.name],
    ['path', trimEnd(dist, '/')],
  ]

  const statsText = stats.map(([name, value]) => `${chalk.gray(name)}: ${chalk.bold.cyan(value)}`).join('\n - ')
  ok(`Module ${name} has been initialized.${chalk.gray(`\n - ${statsText}`)}`)
}

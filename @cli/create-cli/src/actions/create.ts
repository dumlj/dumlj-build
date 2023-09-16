import kebabCase from 'lodash/kebabCase'
import fs from 'fs-extra'
import path from 'path'
import { glob } from 'glob'
import inquirer, { type ChoiceCollection } from 'inquirer'
import { Project } from 'ts-morph'
import * as prettier from 'prettier'
import { ok } from '@dumlj/feature-pretty'
import { prepare } from '@dumlj/feature-prepare'
import { yarnWorkspaces } from '@dumlj/shell-lib'
import { findWorkspaceRootPath } from '@dumlj/util-lib'
import type { TemplateSchema } from '../types'

export interface CreateOptions {
  /** pattern of template name in project */
  pattern?: string
  /** name of config file */
  schema?: string
}

export const create = async (options?: CreateOptions) => {
  const { pattern = '@template/', schema: configFile = 'schema.ts' } = options || {}
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

  const { name, description, template } = await inquirer.prompt<Resp>([
    {
      type: 'list',
      name: 'template',
      message: 'please select a template type for initialization.',
      choices: choices.filter(Boolean),
    },
    {
      type: 'input',
      name: 'name',
      message: 'please input a name for this module.',
      async validate(name, { template }) {
        const { outputPathResolver } = template
        const folder = path.join(rootPath, outputPathResolver(kebabCase(name)))
        if (await fs.pathExists(folder)) {
          return new Error('name is exists')
        }

        const MIN_SIZE = 4
        const MAX_SIZE = 10

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
    },
    {
      type: 'input',
      name: 'description',
      message: 'please input a description for this module.',
      validate(description) {
        const MIN_SIZE = 3
        const MAX_SIZE = 30

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

  const { src, outputPathResolver, pkgTranform, tsTranform } = template
  /** 输出路径 */
  const output = outputPathResolver(kebabCase(name))
  const dist = path.join(rootPath, output)
  const files = await glob('**/*', { cwd: src, nodir: true, ignore: [configFile] })

  await Promise.all(
    files.map(async (file) => {
      const srcFile = path.join(src, file)
      const tranform = async () => {
        if (file === 'package.json') {
          const source = await fs.readJson(srcFile)
          const { output = file } = (await pkgTranform({ name, description, file, source })) || {}
          const outputFile = path.join(dist, output)
          const code = JSON.stringify(source, null, 2)
          return { file: outputFile, code }
        }

        switch (path.extname(file)) {
          case '.ts': {
            const project = new Project()
            const content = await fs.readFile(srcFile, { encoding: 'utf-8' })
            const ast = project.createSourceFile(path.join(dist, file), content)
            const { output = file } = (await tsTranform({ name, description, file, ast })) || {}
            const code = ast.print()
            const outputFile = path.join(dist, output)
            return { file: outputFile, code }
          }
        }
      }

      const { file: output = srcFile, code } = (await tranform()) || {}
      await fs.ensureDir(path.dirname(output))

      try {
        if (!code) {
          await fs.copyFile(srcFile, output)
          return
        }

        const { ignored, inferredParser } = await prettier.getFileInfo(srcFile)
        if (!ignored && inferredParser) {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const prettierOptions = require(path.join(rootPath, '.prettierrc'))
          const prettied = await prettier.format(code, { parser: inferredParser, ...prettierOptions })
          await fs.writeFile(output, prettied)
          return
        }

        await fs.writeFile(output, code)
      } catch (error) {
        fail(error)
      }
    })
  )

  ok(`Module ${name} has been initialized. The module path is ${output}.`)
}

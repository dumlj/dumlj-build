import { fail, ok } from '@dumlj/feature-pretty'
import { prepare } from '@dumlj/feature-prepare'
import { pressAnyToContinue } from '@dumlj/feature-cliui'
import { gitDetectIgnore, yarnWorkspaces } from '@dumlj/shell-lib'
import { findWorkspaceRootPath } from '@dumlj/util-lib'
import { monitorToDevelop } from '@dumlj/seed-cli'
import chalk from 'chalk'
import { trimEnd, kebabCase, defaults } from 'lodash'
import fs from 'fs-extra'
import path from 'path'
import { glob } from 'glob'
import inquirer, { type Validator } from 'inquirer'
import { Project, IndentationText, QuoteKind } from 'ts-morph'
import { highlight } from 'cardinal'
import { DEFAULT_TEMPLATE_PATTERN, DEFAULT_RC_FILE } from './constants'
import type { TemplateSchema } from './types'

export type Template = TemplateSchema & { src: string; key: string }

export interface SelectOptions {
  only?: string[]
}

export interface CompileStats {
  src: string
  out: string
  code: string
}

export type CompileStatsOperates = (stats: CompileStats) => Promise<void>

export interface CompileParams {
  name: string
  description: string
  output: string
  template: Template
}

export interface CompileOptions {
  rc?: string
}

/** result for inquirer */
export interface FormFieldValues {
  /** project name */
  name: string
  /** project description */
  description: string
  /** template for project */
  template: Template
  /** override exists project */
  override: boolean
}

export interface CreateOptions {
  /** project name */
  name?: string
  /** project description */
  description?: string
  /** template for project */
  template?: string
  /** pattern of template name in project */
  pattern?: string
  /** name of config file */
  rc?: string
  /** override exists project */
  override?: boolean
  /** say yes for all confirm  */
  yes?: boolean
}

export class Create {
  /** project name */
  protected name?: string
  /** project description */
  protected description?: string
  /** template for project */
  protected template?: string
  /** pattern of template name in project */
  protected pattern?: string
  /** name of config file */
  protected rc?: string
  /** override exists project */
  protected override?: boolean
  /** say yes for all confirm  */
  protected yes?: boolean

  protected rules: Record<string, Validator<FormFieldValues>>
  private rootPath: string

  constructor(options?: CreateOptions) {
    this.name = options?.name
    this.description = options?.description
    this.template = options?.template
    this.pattern = options?.pattern || DEFAULT_TEMPLATE_PATTERN
    this.rc = options?.rc || DEFAULT_RC_FILE
    this.override = options?.override || false
    this.yes = options?.yes || false

    this.rules = {
      name: async (name: string, { template }) => {
        const { outputPathResolver } = template
        const rootPath = await this.getRootPath()
        const folder = path.join(rootPath, outputPathResolver(kebabCase(name)))
        if (!this.override && (await fs.pathExists(folder))) {
          return 'name is exists'
        }

        const MIN_SIZE = 3
        const MAX_SIZE = 30

        // 必填
        if (!name) {
          return 'name is required.'
        }

        // 最小长度
        if (name.length < MIN_SIZE) {
          return 'name must be more than 4 characters.'
        }

        // 最大长度
        if (name.length > MAX_SIZE) {
          return 'name must be less than 10 characters.'
        }

        // 必须为英文
        if (!/^([a-zA-Z]+?)$/.test(name)) {
          return 'name can only be in English letters.'
        }

        return true
      },
      description: (description: string) => {
        const MIN_SIZE = 3
        const MAX_SIZE = 100

        // 必填
        if (!description) {
          return 'description is required.'
        }

        // 最小长度
        if (description.length < MIN_SIZE) {
          return 'description must be more than 4 characters.'
        }

        // 最大长度
        if (description.length > MAX_SIZE) {
          return 'description must be less than 10 characters.'
        }

        return true
      },
    }
  }

  protected async getRootPath() {
    if (this.rootPath) {
      return this.rootPath
    }

    this.rootPath = await findWorkspaceRootPath()
    return this.rootPath
  }

  public async validate(name: string, value: string, formvalues: FormFieldValues) {
    const validate = this.rules[name]
    if (typeof validate !== 'function') {
      throw new Error(`rule ${name} is not exists`)
    }

    return validate(value, formvalues)
  }

  public async select(options?: SelectOptions) {
    const { only } = options || {}
    const rootPath = await this.getRootPath()
    const workspaces = await yarnWorkspaces()
    const templates = workspaces.filter(({ name }) => new RegExp(`^${this.pattern}`).test(name))
    const choices = await Promise.all(
      templates.map(async ({ name: key, location }) => {
        const config = path.join(rootPath, location, this.rc)
        if (!(await fs.pathExists(config))) {
          return
        }

        const { configure } = await prepare<{ configure: () => Promise<TemplateSchema> }>(config)
        const schema = await configure()
        const { name: sName, description } = await configure()

        const name = `${sName} - ${description}`
        const value = { ...schema, src: path.dirname(config), key }
        return { name, value, key }
      })
    )

    const tempalteKey = this.template ? `${DEFAULT_TEMPLATE_PATTERN}${this.template}` : ''
    const defaultTemplate = tempalteKey ? choices.find(({ key }) => key === tempalteKey)?.value : undefined
    const skip = (name: string) => (Array.isArray(only) ? !only.includes(name) : false)

    const { template }: Pick<FormFieldValues, 'template'> = await inquirer.prompt<FormFieldValues>([
      {
        type: 'list',
        name: 'template',
        message: 'please select a template type for initialization.',
        choices: choices.filter(Boolean),
        default: defaultTemplate,
        when: () => !skip('template') && !this.yes,
      },
    ])

    const formFieldValues: Omit<FormFieldValues, 'template'> = await inquirer.prompt<FormFieldValues>([
      {
        type: 'input',
        name: 'name',
        message: `please input a name for this module.`,
        ...(template?.egName ? { suffix: chalk.grey(`(e.g.${template.egName})`) } : undefined),
        default: this.name,
        when: () => !skip('name') && !this.yes,
        validate: (input, answers) => {
          return this.validate('name', input, { ...answers, template })
        },
        transformer(input) {
          const { nameTransform } = template
          if (typeof nameTransform === 'function') {
            const { name, same, suffix } = nameTransform(input)
            return name.replace(same, ($1) => chalk.cyan($1)).replace(suffix, ($1) => chalk.gray($1))
          }

          return input
        },
      },
      {
        type: 'input',
        name: 'description',
        message: 'please input a description for this module.',
        default: this.description,
        when: () => !skip('description') && !this.yes,
        validate: this.validate.bind(this, 'description'),
      },
      {
        type: 'confirm',
        name: 'override',
        message: 'A project with the same name already exists, are you sure you want to overwrite it?',
        default: true,
        when: () => !skip('override') && !this.yes && !!this.override,
      },
    ])

    return defaults(
      formFieldValues,
      { template },
      {
        name: this.name,
        description: this.description,
        template: defaultTemplate,
      }
    )
  }

  public async compile(params?: CompileParams) {
    const { name, description, output: dist, template } = params
    const { src, pkgTransform, tsTransform } = template
    const files = await glob('**/*', { cwd: src, nodir: true, ignore: [this.rc], dot: true })
    const ignores = await gitDetectIgnore(files)

    /**
     * 没被忽略的文件
     * @description
     * 若项目不是 git 项目，gitDetectIgnore 会返回 undefined
     */
    const noIgnores = Array.isArray(ignores) ? files.filter((file) => !ignores.includes(file)) : files
    const project = new Project({
      manipulationSettings: {
        usePrefixAndSuffixTextForRename: true,
        quoteKind: QuoteKind.Single,
        indentationText: IndentationText.TwoSpaces,
        useTrailingCommas: true,
      },
    })

    return (...statsOperates: CompileStatsOperates[]) =>
      Promise.all(
        noIgnores.map(async (file) => {
          const srcFile = path.join(src, file)
          const tranform = async () => {
            if (file === 'package.json') {
              const source = await fs.readJson(srcFile)
              const tranform = pkgTransform(file)

              if (typeof tranform === 'function') {
                const { output = file } = (await tranform({ name, description, file, source })) || {}
                const outputFile = path.join(dist, output)
                const code = JSON.stringify(source, null, 2)
                return { file: outputFile, code }
              }
            }

            switch (path.extname(file)) {
              case '.ts': {
                const content = await fs.readFile(srcFile, { encoding: 'utf-8' })
                const ast = project.createSourceFile(path.join(dist, file), content)
                const tranform = typeof tsTransform === 'function' ? tsTransform(file) : undefined

                if (typeof tranform === 'function') {
                  const { output = file } = (await tranform({ name, description, ast, file })) || {}
                  const code = ast.getText(true)
                  const outputFile = path.join(dist, output)
                  return { file: outputFile, code }
                }
              }
            }
          }

          const outFile = path.join(dist, file)
          const { file: output = outFile, code } = (await tranform()) || {}
          const operates = [...statsOperates]
          while (operates.length) {
            const fn = operates.shift()
            await fn({ src: srcFile, out: output, code })
          }
        })
      )
  }

  public async debug() {
    // only allow en chars
    const randomText = () => `d${Math.floor(Math.random() * 10e13).toString(32)}`.replace(/\d/g, '')
    const name = this.name || randomText()
    const description = this.description || randomText()
    const { template } = await this.select({ only: ['template'] })
    const tempalteKey = template.key.replace(DEFAULT_TEMPLATE_PATTERN, '')

    if (
      monitorToDevelop('CREATE_CLI_DEVELOP', {
        cwd: template.src,
        argvs: ['--template', tempalteKey, '--yes'],
      })
    ) {
      return
    }

    const { nameTransform, outputPathResolver } = template
    const padLeft = (content: string, size = 2) => {
      const padding = ' '.repeat(size)
      const mapPadding = (text: string) => padding + text
      return content.split('\n').map(mapPadding).join('\n')
    }

    const confirmValue = (name: string, value: any) => {
      const content = JSON.stringify(value, null, 2)
      const messages = [`The following are the results for ${chalk.cyanBright(name)}.`, chalk.cyanBright(padLeft(content))]
      return messages.join('\n\n')
    }

    const confirmFile = (file: string, code: string) => {
      const messages = [`The following are the content for ${chalk.cyanBright(file)}.`, highlight(padLeft(code))]
      return messages.join('\n\n')
    }

    const rootPath = await this.getRootPath()
    const { shortName } = typeof nameTransform === 'function' ? nameTransform(name) : { shortName: name }

    /** 输出路径 */
    const output = outputPathResolver(kebabCase(shortName))
    const dist = path.join(rootPath, output)
    const render = await this.compile({ name, description, template, output: dist })
    const codes: Array<{ out: string; code: string }> = []
    await render(async ({ out, code }) => {
      if (!code) {
        return
      }

      codes.push({ out, code })
    })

    const debugs = [
      nameTransform ? confirmValue('nameTransform', nameTransform(name)) : undefined,
      confirmValue('outputPathResolver', outputPathResolver(name)),
      ...codes.map(({ out, code }) => {
        return confirmFile(out, code)
      }),
    ].filter(Boolean)

    while (debugs.length) {
      const message = debugs.shift()
      await pressAnyToContinue({ message })
      /* eslint-disable-next-line no-console */
      console.log('')
    }

    ok(`Execution complete. You can modify the template file and re-execute it or press ${chalk.whiteBright('Ctrl + C')} to exit.`)
  }

  public async create() {
    const rootPath = await this.getRootPath()
    const { name, description, template, override } = await this.select()
    const { nameTransform, outputPathResolver } = template
    const { shortName } = typeof nameTransform === 'function' ? nameTransform(name) : { shortName: name }

    /** 输出路径 */
    const output = outputPathResolver(kebabCase(shortName))
    const dist = path.join(rootPath, output)

    if (typeof override === 'boolean') {
      if (this.yes !== true && !override) {
        return
      }

      const folder = path.join(rootPath, outputPathResolver(shortName))
      await fs.remove(folder)
    }

    const render = await this.compile({ name, description, output: dist, template })
    await render(async ({ src, out, code }) => {
      await fs.ensureDir(path.dirname(out))

      try {
        if (!code) {
          await fs.copyFile(src, out)
          return
        }

        await fs.writeFile(out, code)
      } catch (error) {
        fail(error)
      }
    })

    const stats = [
      ['name', shortName],
      ['description', description],
      ['template', template.name],
      ['path', trimEnd(output, '/')],
    ]

    const statsText = stats.map(([name, value]) => `${chalk.gray(name)}: ${chalk.bold.cyan(value)}`).join('\n - ')
    ok(`Module ${shortName} has been initialized.${chalk.gray(`\n - ${statsText}`)}`)
  }
}

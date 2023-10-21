import path from 'path'
import { type IApi } from 'dumi'
import chalk from 'chalk'
import { findOutdateds } from '@dumlj/feature-updater'
import VirtualModulesPlugin from 'webpack-virtual-modules'
import type { Assign } from 'utility-types'
import type { Compiler, WebpackPluginInstance } from 'webpack'
import inclusion from 'inclusion'
import { regsiterRemarkCustomComponent, type CustomComponentRender } from './regsiterRemarkCustomComponent'
import { SYNTAX_PLUGIN_SUFFIX, SYNTAX_MODULE_SUFFIX } from './constants'

export interface RegisterComponentOptions<A extends Record<string, string> = Record<string, string>> {
  /** 文件 */
  webComponentFile?: string
  /** 标签 */
  tag?: string
  /** 渲染函数 */
  render?: CustomComponentRender<A>
}

export interface Helper<O extends Record<string, any>> {
  regsiterComponent<A extends Record<string, string>>(options?: RegisterComponentOptions<A>): void
  pushWebpackPlugin(name: string, plugin: WebpackPluginInstance): void
  getOptions?: () => O
}

export type Api<T extends Record<string, any>> = Assign<IApi, { useConfig: Assign<IApi['userConfig'], T> }>

export const createDumiPlugin = <O extends Record<string, any>>(name: string, factory: (api: Api<O>, helper: Helper<O>) => Promise<void>) => {
  const yellOutdateds = async (api: Api<O>) => {
    const outdates = await findOutdateds()
    outdates.forEach(({ name, updateType, version, latestVersion }) => {
      const message = [`${chalk.bold(name)}@${chalk.bold(version)} has a new ${chalk.bold(updateType)} version,`, `please update to ${chalk.bold(latestVersion)}.`]
      api.logger.warn(message.join(''))
    })
  }

  const makeWebpackPluginPusher = (api: Api<O>) => (name: string, plugin: WebpackPluginInstance) => {
    api.chainWebpack((config) => {
      if (config.get(name)) {
        api.logger.warn(`webpack plugin ${chalk.yellowBright(name)} is exists, skip...`)
        return
      }

      const record = config.plugin(name).use(plugin)
      config.plugins.set(name, record)
    })
  }

  const makeOptionsGetter = (api: Api<O>) => () => {
    return api?.userConfig?.[name] || {}
  }

  const makeCustomComponentRegsiter = async (api: Api<O>, customComponents: Map<string, string>) => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    const { unified } = (await inclusion('unified')) as typeof import('unified')
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    const { default: remarkParse } = (await inclusion('remark-parse')) as typeof import('remark-parse')
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    const { default: remarkFrontmatter } = (await inclusion('remark-frontmatter')) as typeof import('remark-frontmatter')
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    const { default: remarkDirective } = (await inclusion('remark-directive')) as typeof import('remark-directive')
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    const { default: remarkGfm } = (await inclusion('remark-gfm')) as typeof import('remark-gfm')

    const processor = unified().use(remarkParse).use(remarkFrontmatter).use(remarkDirective).use(remarkGfm)

    return (options?: RegisterComponentOptions) => {
      const { tag, webComponentFile, render } = options || {}
      const parseAST = (content: string) => processor.parse(content)
      const fn = regsiterRemarkCustomComponent(name, { tag, render, parseAST })
      const customSyntax = fn(api)
      webComponentFile && customComponents.set(customSyntax, webComponentFile)
    }
  }

  return async (api: Api<O>) => {
    await yellOutdateds(api)

    const customComponents = new Map<string, string>()
    const regsiterComponent = await makeCustomComponentRegsiter(api, customComponents)
    const pushWebpackPlugin = makeWebpackPluginPusher(api)
    const getOptions = makeOptionsGetter(api)
    await factory(api, { regsiterComponent, pushWebpackPlugin, getOptions })

    /** 自定义语义 */
    if (customComponents.size > 0) {
      const PLUGIN_NAME = `${name}.${SYNTAX_PLUGIN_SUFFIX}`

      pushWebpackPlugin(PLUGIN_NAME, {
        apply(compiler: Compiler) {
          const { webpack, context } = compiler
          // 创建虚拟模块
          const vm = new VirtualModulesPlugin()
          vm.apply(compiler)

          const alias = `${name}-${SYNTAX_MODULE_SUFFIX}`
          compiler.hooks.thisCompilation.tap(PLUGIN_NAME, () => {
            const source = Array.from(customComponents.entries()).flatMap(([syntax, file]) => {
              return [`import ${name}Syntax from "${file}"`, `export const ${name} = { syntax: "${syntax}", component: ${name}Syntax }`]
            })

            vm.writeModule(`node_modules/${alias}.js`, source.join('\n'))
          })

          // 创建入口
          new webpack.DefinePlugin({ __SYNTAX_MODULE_NAME__: JSON.stringify(alias) }).apply(compiler)
          new webpack.EntryPlugin(context, path.join(__dirname, 'client'), { filename: `${name}.syntax.js` }).apply(compiler)
        },
      })
    }
  }
}

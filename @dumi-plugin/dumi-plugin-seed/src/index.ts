import path from 'path'
import { type IApi } from 'dumi'
import chalk from 'chalk'
import { findOutdateds } from '@dumlj/feature-updater'
import VirtualModulesPlugin from 'webpack-virtual-modules'
import type { Assign } from 'utility-types'
import type { Compiler, WebpackPluginInstance } from 'webpack'
import { regsiterRemarkSyntax } from './regsiterRemarkSyntax'
import { SYNTAX_PLUGIN_SUFFIX, SYNTAX_MODULE_SUFFIX } from './constants'

export interface RegisterSyntaxOptions {
  syntax?: string
  file?: string
}

export interface Helper {
  registerSyntax(options?: RegisterSyntaxOptions): void
  pushWebpackPlugin(name: string, plugin: WebpackPluginInstance): void
}

export type Api<T extends Record<string, any>> = Assign<IApi, { useConfig: Assign<IApi['userConfig'], T> }>

export const createDumiPlugin = <O extends Record<string, any>>(name: string, factory: (api: Api<O>, helper: Helper) => Promise<void>) => {
  const yellOutdateds = async (api: Api<O>) => {
    const outdates = await findOutdateds()
    outdates.forEach(({ name, updateType, version, latestVersion }) => {
      const message = [`${chalk.bold(name)}@${chalk.bold(version)} has a new ${chalk.bold(updateType)} version,`, `please update to ${chalk.bold(latestVersion)}.`]
      api.logger.warn(message.join(''))
    })
  }

  const mkPushWebpackPlugin = (api: Api<O>) => (name: string, plugin: WebpackPluginInstance) => {
    api.chainWebpack((config) => {
      if (config.get(name)) {
        api.logger.warn(`webpack plugin ${chalk.yellowBright(name)} is exists, skip...`)
        return
      }

      const record = config.plugin(name).use(plugin)
      config.plugins.set(name, record)
    })
  }

  return async (api: Api<O>) => {
    await yellOutdateds(api)

    const customSyntaxes = new Map<string, string>()
    const registerSyntax = (options?: RegisterSyntaxOptions) => {
      const { syntax, file } = options || {}
      const fn = regsiterRemarkSyntax(name, syntax)
      const customSyntax = fn(api)
      file && customSyntaxes.set(customSyntax, file)
    }

    const pushWebpackPlugin = mkPushWebpackPlugin(api)
    await factory(api, { registerSyntax, pushWebpackPlugin })

    /** 自定义语义 */
    if (customSyntaxes.size > 0) {
      const PLUGIN_NAME = `${name}.${SYNTAX_PLUGIN_SUFFIX}`

      pushWebpackPlugin(PLUGIN_NAME, {
        apply(compiler: Compiler) {
          const { webpack, context } = compiler
          // 创建虚拟模块
          const vm = new VirtualModulesPlugin()
          vm.apply(compiler)

          const alias = `${name}-${SYNTAX_MODULE_SUFFIX}`
          compiler.hooks.thisCompilation.tap(PLUGIN_NAME, () => {
            const source = Array.from(customSyntaxes.entries()).flatMap(([syntax, file]) => {
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

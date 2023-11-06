import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import { guid, defenv } from '@dumlj/util-lib'
import defaultsDeep from 'lodash/defaultsDeep'
import chalk from 'chalk'
import { pushScriptToEntries } from './utils/pushScriptToEntries'
import { makeGetEnvFnRenderer } from './utils/makeGetEnvFnRenderer'
import { GLOBAL_TARGET, FIND_ENV_MODULE } from './constants/conf'
import type { Compiler } from 'webpack'

export interface DynamicEnvsWebpackPluginOptions extends SeedWebpackPluginOptions {
  /** 存储环境变量的全局变量 */
  globalThis?: string
  /** 获取环境变量所在全局变量的方法名称 */
  globalThisFn?: string
  /** 环境变量存储在全局变量中的名称 */
  globalThisProp?: string
  /** 脚本路径 */
  scriptPath?: string
}

export class DynamicEnvsWebpackPlugin extends SeedWebpackPlugin {
  static PLUGIN_NAME = 'dynamic-envs-webpack-plugin'

  public variables: Record<string, any>
  public warnings: string[]

  protected globalThis: string
  protected globalThisProp: string
  protected globalThisFn: string
  protected scriptPath: string

  /**
   * 是否已经注入
   * @description
   * 因为 DefinePlugin 动态无法修改环境变量
   * 因此只要提示一次，且触发一次注入即可
   */
  private injected: boolean

  constructor(envs?: Record<string, any>, options?: DynamicEnvsWebpackPluginOptions) {
    super(options)

    this.variables = typeof envs === 'object' ? envs : {}
    this.globalThis = options?.globalThis ?? GLOBAL_TARGET
    this.globalThisFn = options?.globalThisFn ?? guid()
    this.globalThisProp = options?.globalThisProp ?? this.globalThisFn.toUpperCase()
    this.scriptPath = options?.scriptPath ?? FIND_ENV_MODULE
    this.injected = false
  }

  public update() {}

  /** 注入模块 */
  protected applyInject(compiler: Compiler) {
    const { options } = compiler
    options.resolve.fallback = {
      ...options.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    }

    if (this.scriptPath) {
      const pushScript = pushScriptToEntries(this.scriptPath)
      if (typeof options.entry === 'function') {
        const noConflit = options.entry
        options.entry = async function (this: any, ...args: any[]) {
          const entries = await noConflit.call(this, ...args)
          return pushScript(entries)
        }
      } else if (typeof options.entry === 'object') {
        options.entry = pushScript(options.entry)
      }
    }
  }

  /** 注入变量 */
  protected applyDefine(compiler: Compiler) {
    const { webpack, options } = compiler
    const { DefinePlugin } = webpack

    // 收集前面的 DefinePlugin 环境变量
    const plugins = options.plugins.filter((plugin) => plugin.constructor.name === DefinePlugin.name) as Array<InstanceType<typeof DefinePlugin>>
    const originalValues = plugins.reduce((variables, plugin) => Object.assign(variables, plugin.definitions), {})
    const renderGetEnvFn = makeGetEnvFnRenderer(this.globalThisFn, this.globalThis)
    const { raw: envs, stringified: variables } = defenv(renderGetEnvFn)(this.variables)

    /**
     * 关键变量
     * 主要用于替换 /tempaltes/find-env.ts 中的变量以做到动态函数名
     */
    const keyVariables = {
      __GLOBAL_TARGET__: this.globalThis,
      __GLOBAL_PROP_NAME__: JSON.stringify(this.globalThisProp),
      __GLOBAL_PROP_FN__: JSON.stringify(this.globalThisFn),
    }

    const clonedVariables: Record<string, any> = Object.assign({}, keyVariables, variables)

    // 这里主要为了解决 `process.env = { app: 123 }` 优先于 `process.env.app` 问题
    // 由于第三方包可能存在遍历 `process.env` 的情况, 因此这里不能将 dotenv 变量
    // 存放到 `process.env` 中, 而是使用 `process.env.[name]` 的配置方式注入环境变量
    const definitions = new Proxy(clonedVariables, {
      set(target, prop: string, value) {
        if (prop === 'process.env') {
          const filters = Object.keys(envs)
          const finalValue = Object.keys(value).reduce((resp, name) => {
            if (-1 === filters.indexOf(name)) {
              resp[name] = value[name]
            }

            return resp
          }, {})

          target[prop] = finalValue
          return true
        }

        target[prop] = value
        return true
      },
    })

    const originalKeys = Object.keys(originalValues)
    const conflitedKeys = Object.keys(definitions).filter((name) => originalKeys.includes(name))

    // 合并所有变量
    defaultsDeep(definitions, keyVariables, originalValues)

    // 收集后面的 DefinePlugin 环境变量
    const noConflit = DefinePlugin.prototype.apply
    DefinePlugin.prototype.apply = function (compiler) {
      Object.keys(this.definitions).forEach((name) => {
        if (typeof definitions[name] === 'undefined') {
          definitions[name] = this.definitions[name]
        }
      })

      // 以防插件没有被调用
      // 相同的字段不会告警
      noConflit.call({ definitions }, compiler)
    }

    // 去除前面的 DefinePlugin
    options.plugins = plugins.filter((plugin) => !plugins.includes(plugin))
    noConflit.call({ definitions }, compiler)

    const warnnings: string[] = conflitedKeys.map((name) => `Conflicting values for ${name}`)
    compiler.hooks.afterCompile.tapPromise(this.pluginName, async (compilation) => {
      if (this.injected === true) {
        return
      }

      compilation.warnings = compilation.warnings.filter((error) => {
        const { message } = error || {}
        if (-1 === error?.message.indexOf('DefinePlugin\nConflicting values for ')) {
          return true
        }

        const name = message.replace(/DefinePlugin\nConflicting values for \'(.+?)\'/, '$1')
        if (Object.keys(definitions).indexOf(name) === -1) {
          const index = message.indexOf('DefinePlugin\n')
          const content = message.substring(index)
          warnnings.indexOf(message) === -1 && warnnings.push(content)
        }
      })
    })

    compiler.hooks.done.tap(this.pluginName, () => {
      if (this.injected === true) {
        return
      }

      this.injected = true

      if (warnnings.length > 0) {
        this.logger.warn(`WARNNING in DefinePlugin`)
        warnnings.forEach((message) => this.logger.warn(message))
      }

      if (this.silence !== true && this.verbose === true) {
        this.logger.info(chalk.bold('The following are environment variables'))

        Object.keys(definitions).map((name) => {
          const value = definitions[name]
          this.logger.info(`${chalk.cyan(name)} => ${chalk.cyan(JSON.stringify(value, null, 2))}`)
        })
      }
    })
  }

  public apply(compiler: Compiler) {
    super.apply(compiler)

    this.applyInject(compiler)
    this.applyDefine(compiler)
  }
}

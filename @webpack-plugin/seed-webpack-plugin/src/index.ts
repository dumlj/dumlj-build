import { findOutdateds } from '@dumlj/feature-updater'
import { promisify } from 'util'
import chalk from 'chalk'
import type { Compiler } from 'webpack'
import type { Class } from 'utility-types'

const DEFAULT_CHECK_OUTDATED = !!process.env.DUMLJ_CHECK_OUTDATED || false

/** 基础插件配置项 */
export interface SeedWebpackPluginOptions {
  /** 打印详细信息 */
  verbose?: boolean
  /** 过滤所有打印信息 */
  silence?: boolean
  /** 是否检测过期 */
  checkOutdatd?: boolean
}

/** 基础插件 */
export class SeedWebpackPlugin<P extends SeedWebpackPluginOptions = SeedWebpackPluginOptions> {
  /**
   * 插件名称
   * @description
   * 继承时请保证名称不统一
   */
  static PLUGIN_NAME = 'seed-webpack-plugin'

  public options?: P
  public verbose: boolean
  public silence: boolean
  public checkOutdatd?: boolean

  /** 通知信息 */
  protected messages: Array<{ type: 'info' | 'warn' | 'error'; message: string }>
  /** 记录 */
  protected logger!: ReturnType<Compiler['getInfrastructureLogger']>

  /**
   * 获取当前插件名称
   * @description
   * 该方法可以获得继承后的插件名称，可通过`PLUGIN_NAME`静态属性设置
   */
  public get pluginName() {
    const { PLUGIN_NAME = 'anonymous-plugin' } = Object.getPrototypeOf(this)?.constructor
    return PLUGIN_NAME
  }

  constructor(options?: P) {
    this.options = options
    this.verbose = typeof options?.verbose === 'boolean' ? options.verbose : false
    this.silence = typeof options?.silence === 'boolean' ? options.silence : false
    this.checkOutdatd = typeof options?.checkOutdatd === 'boolean' ? options.checkOutdatd : DEFAULT_CHECK_OUTDATED
    this.messages = []
  }

  public apply(compiler: Compiler) {
    this.applyNotify(compiler)

    if (this.checkOutdatd === true) {
      this.applyOutdated(compiler)
    }
  }

  /**
   * 注册 Logger
   * @description
   * 注册的 logger 与 notify 关联，
   * 结束的时候统一打印日志，这样可以比较好输出。
   */
  public applyNotify(compiler: Compiler) {
    const name = this.pluginName.replace('-plugin', '')
    /** webpack 自带的 logger */
    this.logger = compiler.getInfrastructureLogger(name)

    compiler.hooks.afterEmit.tap(this.pluginName, () => {
      if (Array.isArray(this.messages) && this.messages.length > 0) {
        this.messages.forEach(({ type, message }) => {
          if (this.logger && 'type' in this.logger && typeof this.logger[type] === 'function') {
            this.logger[type](message)
          }
        })
      }
    })
  }

  /**
   * 注册"过期通知"能力
   * @description
   * 因为迭代原因，插件更新需要通知。
   * 这里整合 OutdatedWebpackPlugin 来完成更新提醒。
   */
  public applyOutdated(compiler: Compiler) {
    const index = compiler.options.plugins.findIndex((plugin) => {
      if (plugin && 'pluginName' in plugin && typeof plugin.pluginName === 'string') {
        return plugin.pluginName === OutdatedWebpackPlugin.PLUGIN_NAME
      }
    })

    if (-1 === index && process.env.NODE_ENV !== 'production' && !process.env.CI) {
      compiler.options.plugins.push(new OutdatedWebpackPlugin())
    }
  }

  /**
   * 传入数据不完整跳过
   * @description
   * 辅助函数。
   * 用于部分传入配置不完整时跳过某些逻辑。
   */
  protected isSkipIncomplete(title: string, variables: Record<string, string | undefined>) {
    const names = Object.keys(variables)
    const invalids = names.filter((name) => {
      const value = variables[name]
      return typeof value === 'string' && value.length > 0
    })

    if (invalids.length > 0) {
      this.notify('warn', `${title}\nThe following options are missing: ${['', ...invalids].join('\n - ')}`)
      return true
    }

    return false
  }

  /**
   * 通知
   * @description
   * 因为 webpack 具有很多种时机，
   * 因此这里只会将信息预先保存起来，
   * 待到指定时机时可手动输出。
   */
  protected notify(type: 'info' | 'warn' | 'error', message: string) {
    this.messages.push({ type, message })
  }

  /** 工具化 fs */
  protected utilizeFSB(compiler: Compiler) {
    const { inputFileSystem: inputFS, outputFileSystem: outputFS } = compiler
    const pathExists = async (file: string) => {
      const promisifyStat = promisify(inputFS.stat)
      await promisifyStat(file).catch((error) => {
        if ('code' in error && error.code === 'ENOENT') {
          return false
        }

        return Promise.reject(error)
      })

      return true
    }

    const promisifyReaddir = promisify(inputFS.readdir.bind(inputFS))
    const readdir = async (dir: string) => {
      const files = await promisifyReaddir(dir)
      if (!Array.isArray(files)) {
        return []
      }

      return files.filter((file): file is string => typeof file === 'string')
    }

    const readFile = promisify(inputFS.readFile.bind(inputFS))
    const writeFile = promisify(outputFS.writeFile.bind(outputFS))

    return { pathExists, readdir, readFile, writeFile }
  }

  /**
   * 插件能力使用
   * @param Plugin 必须为继承 `SeedWebpackPlugin` 的插件类
   * @description
   * 很多时候我们并不是简单继承某个插件的功能，
   * 而是通过合并不同的插件功能来达到新的效果。
   * 该方法主要帮助我们整合插件，暂时只是名称上整合；
   * 若每个功能都拥有自己的名字则无法很好找到对应插件的信息。
   */
  protected use<T extends Class<Pick<SeedWebpackPlugin, 'apply'>> & { PLUGIN_NAME: string }>(Plugin: T) {
    const { pluginName } = this

    const OverridePlugin = class OverridePlugin extends Plugin {
      static PLUGIN_NAME = pluginName
    }

    return OverridePlugin
  }
}

/**
 * 版本过期通知插件
 * @description
 * 与 SeedWebpackPlugin 相互引用
 * - OutdatedWebpackPlugin 继承 SeedWebpackPlugin
 * - SeedWebpackPlugin 在执行时才会调用 OutdatedWebpackPlugin
 */
export class OutdatedWebpackPlugin extends SeedWebpackPlugin {
  static PLUGIN_NAME = 'outdated-webpack-plugin'

  /** 是否已经检测过 */
  protected hasChecked?: boolean

  /** 版本过期警告 */
  public async yellOutdateds() {
    // 检查过就不在检查
    if (this.hasChecked) {
      return
    }

    // 有缘提示无缘略过
    this.hasChecked = true

    const outdates = await findOutdateds()
    outdates.forEach(({ name, updateType, version, latestVersion }) => {
      const message = [`${chalk.bold(name)}@${chalk.bold(version)} has a new ${chalk.bold(updateType)} version,`, `please update to ${chalk.bold(latestVersion)}.`]
      this.logger.warn(...message)
    })
  }

  public async apply(compiler: Compiler) {
    super.applyNotify(compiler)

    // 结束时提示
    compiler.hooks.afterDone.tap(this.pluginName, () => {
      this.yellOutdateds().catch((error) => {
        this.logger.error(error)
      })
    })
  }
}

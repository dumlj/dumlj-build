import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import { validateDotEnv } from '@dumlj/feature-dotenv'
import chalk from 'chalk'
import { glob } from 'glob'
import type { Compiler } from 'webpack'

export interface CompareEnvsWebpackPluginOptions extends SeedWebpackPluginOptions {
  /**
   * 对比其他环境变量文件
   * @description
   * 此部分环境变量会作为 `{ [key]: '' }` 存储到环境变量中
   */
  compare?: string | string[]
  /**
   * 跳过 Dev 模式对比
   * @description
   * 默认为 false
   */
  skipCompareDevMode?: boolean
}

export class CompareEnvsWebpackPlugin extends SeedWebpackPlugin {
  static PLUGIN_NAME = 'compare-envs-webpack-plugin'

  protected compare: string | string[]
  protected skipCompareDevMode: boolean

  constructor(options?: CompareEnvsWebpackPluginOptions) {
    super(options)

    this.compare = options?.compare
    this.skipCompareDevMode = typeof options?.skipCompareDevMode === 'boolean' ? options?.skipCompareDevMode : false
  }

  /** 查找 dotenv 文件 */
  protected async lookupDotenvFiles(pattern: string | string[], context: string = process.cwd()) {
    if (!((typeof pattern === 'string' || Array.isArray(pattern)) && pattern.length > 0)) {
      return []
    }

    try {
      return glob(pattern, { cwd: context, absolute: true })
    } catch (error) {
      return
    }
  }

  public applyCompare(compiler: Compiler) {
    const { webpack, options } = compiler
    const { WebpackError } = webpack
    const { mode } = options

    const compare = async () => {
      const files = await this.lookupDotenvFiles(this.compare)
      if (files.length === 0) {
        this.logger.warn('Not found any dotenv files.')
        return true
      }

      const invalids = await validateDotEnv(files)
      return invalids.length > 0
        ? `The environment variables (dotenv) is incorrectly configured \n - ${invalids.join(
            '\n - '
          )} \nPlease set the missing envs to empty string in the above file. e.g \`ABC=\``
        : true
    }

    if (mode === 'production') {
      compiler.hooks.beforeCompile.tapPromise(this.pluginName, async () => {
        const result = await compare()
        if (result !== true) {
          this.logger.error(result)

          const error = new WebpackError(`[${this.pluginName}] Compare dotenv files failed.`)
          return Promise.reject(error)
        }
      })
    } else {
      compiler.hooks.done.tapPromise(this.pluginName, async ({ compilation }) => {
        /** 跳过 */
        if (this.skipCompareDevMode) {
          return
        }

        const result = await compare()
        if (result !== true) {
          this.logger.warn(result)

          const warning = new WebpackError(chalk.yellow(result))
          compilation.warnings.push(warning)
        }
      })
    }
  }

  public apply(compiler: Compiler) {
    super.apply(compiler)
    this.applyCompare(compiler)
  }
}

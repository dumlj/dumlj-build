import { SeedWebpackPlugin } from '@dumlj/seed-webpack-plugin'
import { CompareEnvsWebpackPlugin } from '@dumlj/compare-envs-webpack-plugin'
import { DynamicEnvsWebpackPlugin, type DynamicEnvsWebpackPluginOptions } from '@dumlj/dynamic-envs-webpack-plugin'
import { guid } from '@dumlj/util-lib'
import fs from 'fs'
import chalk from 'chalk'
import dotenv from 'dotenv'
import path from 'path'
import { NodeScriptChildCompilerWebpackPlugin } from './NodeScriptChildCompilerWebpackPlugin'
import { SCRIPT_SRC } from './constants/conf'
import type { Compiler, WebpackPluginInstance } from 'webpack'

export interface EnvsSwitchWebpackPluginOptions extends DynamicEnvsWebpackPluginOptions {
  /** output file */
  filename?: string
  /** 额外环境变量 */
  envs?: Record<string, any>
  /**
   * 跳过 Dev 模式对比
   * @description
   * 默认为 false
   */
  skipCompareDevMode?: boolean
  /** 环境变量文件夹, 默认为 dotenv */
  dotenvFolder?: string
  /** 文件夹文件格式, 默认为 $1.env, $1 为环境名 */
  dotenvFormater?: string
  /** dotenv 文件, 默认为 .env */
  dotenvFilename?: string
}

export class EnvsSwitchWebpackPlugin extends SeedWebpackPlugin {
  static PLUGIN_NAME = 'envs-switch-webpack-plugin'

  protected filename: string
  protected output: string
  protected hash: string
  protected envs: Record<string, any>
  protected skipCompareDevMode: boolean
  protected scriptPath?: string
  protected dotenvFolder: string
  protected dotenvFormater: string
  protected dotenvFilename: string
  protected globalThisProp: string
  protected guid: string
  protected variablesInEnvironments: Record<string, Record<string, string>>

  constructor(options?: EnvsSwitchWebpackPluginOptions) {
    super(options)

    this.filename = options?.filename || 'switch-env'
    this.envs = options?.envs || {}
    this.dotenvFolder = options?.dotenvFolder || 'dotenv'
    this.dotenvFormater = options?.dotenvFormater || '$1.env'
    this.dotenvFilename = options?.dotenvFilename || '.env'
    this.guid = guid()
    this.variablesInEnvironments = {}
  }

  /** compare difference dotenv files */
  public applyCompare(compiler: Compiler) {
    const Compare = this.use(CompareEnvsWebpackPlugin)
    const compare = path.join(this.dotenvFolder, '*.env')
    new Compare({ compare, skipCompareDevMode: this.skipCompareDevMode }).apply(compiler)
  }

  /** inject envs into entry */
  public applyInjectEnvs(compiler: Compiler) {
    const { context } = compiler
    const outputPath = compiler.outputPath || 'dist'

    this.output = this.output || outputPath
    this.output = path.isAbsolute(this.output) ? this.output : path.join(context, this.output)

    const folder = path.isAbsolute(this.dotenvFolder) ? this.dotenvFolder : path.join(context, this.dotenvFolder)
    const variables = this.collectDotenv(folder)

    const file = path.join(context, '.env')
    const { parsed: defaultVariables } = dotenv.config({ path: file })
    const finalVariables = { ...this.envs, ...defaultVariables }

    for (const envs of Object.values(variables)) {
      for (const name in envs) {
        if (!(name in finalVariables)) {
          finalVariables[name] = undefined
        }
      }
    }

    const Plugin = this.use(DynamicEnvsWebpackPlugin)
    new Plugin(finalVariables, { ...this.options, globalThisProp: this.guid }).apply(compiler)

    this.variablesInEnvironments = variables
  }

  protected collectDotenv(folder: string) {
    if (!fs.existsSync(folder)) {
      return
    }

    const variables: Record<string, Record<string, string>> = {}
    for (const name of fs.readdirSync(folder)) {
      const src = path.join(folder, name)
      if (!fs.statSync(src).isFile()) {
        return
      }

      const type = path.basename(name).replace(path.extname(name), '')
      const source = fs.readFileSync(src)
      variables[type] = dotenv.parse(source)
    }

    return variables
  }

  /** generate switch script */
  public applySwitchScript(compiler: Compiler) {
    const { context, webpack } = compiler
    const outputPath = compiler.outputPath || 'dist'

    this.output = this.output || outputPath
    this.output = path.isAbsolute(this.output) ? this.output : path.join(context, this.output)

    compiler.hooks.thisCompilation.tap(this.pluginName, (compilation) => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: this.pluginName,
          /**
           * html-webpack-plugin hooks are not used here,
           * just execute them after html-webpack-plugin builds the hooks.
           * @see https://github.com/jantimon/html-webpack-plugin/blob/fe231d3d3d256c2bb904b9e0f3f1e7aa67d7f3cd/index.js#L164
           */
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        async (assets) => {
          const htmls: string[] = []
          for (const name of Object.keys(assets)) {
            if (path.extname(name) === '.html') {
              const file = path.relative(compiler.context, path.join(this.output, name))
              htmls.push(file)
            }
          }

          await this.spwanCompile(compiler, [
            new NodeScriptChildCompilerWebpackPlugin(compilation),
            new webpack.DefinePlugin({
              __ENVS_SWITCH_GUID__: JSON.stringify(this.guid),
              __ENVS_SWITCH_CONFIG__: JSON.stringify({ envs: this.variablesInEnvironments, htmls }),
            }),
          ])
        }
      )
    })
  }

  protected spwanCompile(compiler: Compiler, plugins: WebpackPluginInstance[]) {
    return new Promise<void>((resolve, reject) => {
      const { webpack, options } = compiler
      const childCompiler = webpack({
        mode: 'production',
        target: 'node',
        entry: {
          [this.filename]: SCRIPT_SRC,
        },
        output: {
          ...options.output,
        },
        plugins: [...plugins],
        node: {
          __filename: false,
        },
      })

      childCompiler.run((error) => (error ? reject(error) : resolve()))
    })
  }

  public apply(compiler: Compiler) {
    super.apply(compiler)

    this.applyCompare(compiler)
    if (compiler.options.mode !== 'production') {
      this.logger.info(chalk.cyan.bold(`Skip generate swtich script in development mode.`))
      return
    }

    this.applyInjectEnvs(compiler)
    this.applySwitchScript(compiler)
  }
}

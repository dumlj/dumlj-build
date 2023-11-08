import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import { DynamicEnvsWebpackPlugin } from '@dumlj/dynamic-envs-webpack-plugin'
import { HtmlInjectEnvsWebpackPlugin } from '@dumlj/html-inject-envs-webpack-plugin'
import { InjectEntryScriptWebpackPlugin } from '@dumlj/inject-entry-script-webpack-plugin'
import HtmlWebpackPlugin, { type Options as HtmlWebpackPluginOptions } from 'html-webpack-plugin'
import type { Compiler } from 'webpack'
import { htmlify } from './utils/htmlify'
import { trimUrlPathEnd, trimUrlPath } from './utils/trimUrl'
import { mapDynamicPublicPaths } from './utils/public-path'
import { PUBLIC_PATH_MODULE_SCRIPT_PATH } from './constants/conf'

export type PublicPaths = Record<
  string,
  | string
  | {
      /** 公共路径 */
      publicPath: string
      /** 额外环境变量 */
      envs?: Record<string, string>
    }
>

export interface DynamicPublicPathWebpackPluginOptions extends SeedWebpackPluginOptions, HtmlWebpackPluginOptions {
  scriptPath?: string
}

export class DynamicPublicPathWebpackPlugin extends SeedWebpackPlugin<DynamicPublicPathWebpackPluginOptions> {
  static PLUGIN_NAME = 'dynamic-public-path-webpack-plugin'

  protected publicPath: string
  protected publicPaths: Record<string, string>
  protected envs: Set<string>
  protected variables: Record<string, Record<string, string>>
  protected scriptPath: string

  constructor(publicPaths: PublicPaths = {}, options?: DynamicPublicPathWebpackPluginOptions) {
    super(options)

    this.publicPaths = {}
    this.variables = {}
    this.envs = new Set<string>()
    this.scriptPath = options?.scriptPath || PUBLIC_PATH_MODULE_SCRIPT_PATH

    Object.keys(publicPaths).forEach((name) => {
      const filename = htmlify(name)
      const data = publicPaths[name]

      if (typeof data === 'string') {
        this.publicPaths[filename] = data
      }

      if (typeof data === 'object') {
        const { publicPath, envs } = data
        this.publicPaths[filename] = publicPath

        if (typeof envs === 'object') {
          Object.keys(envs).forEach(this.envs.add.bind(this.envs))
          this.variables[filename] = envs
        }
      }
    })
  }

  public applyPublicPath(compiler: Compiler) {
    const { options } = compiler

    // subfix 默认为 `/`, 而 prefix 默认为空字符串
    let subfix = typeof this.publicPath === 'string' ? trimUrlPath(this.publicPath) : ''
    subfix = subfix ? `/${subfix}/` : '/'

    // 重置 publicPath 插件优先
    if (typeof options.output.publicPath === 'undefined') {
      options.output.publicPath = subfix
    }

    const emptyVariables: Record<string, void> = {}

    // 动态创建对应 public path 的入口 HTML 文件
    mapDynamicPublicPaths(this.publicPaths, ({ publicPath: prefix, filename }) => {
      // subfix 默认为 `/`, 而 prefix 默认为空字符串
      prefix = trimUrlPathEnd(prefix)
      prefix = prefix ? `${prefix}` : ''

      const publicPath = `${prefix}${subfix}`
      const htmlWebpackPluginInstance = new HtmlWebpackPlugin({
        ...this.options,
        publicPath,
        filename,
      })

      const variables = Object.assign({}, this?.variables?.[filename] || {}, {
        'process.env.PUBLIC_PATH': publicPath,
      })

      const envs: Record<string, string> = {}
      for (const [name, value] of Object.entries(variables)) {
        emptyVariables[name] = undefined

        const token = name.replace('process.env.', '')
        envs[token] = value
      }

      /**
       * for html
       * inject script tag with variables
       */
      const EnvPlugin = this.use(HtmlInjectEnvsWebpackPlugin)
      new EnvPlugin(envs, { globalThisProp: 'dynamicPublicPath', htmlNS: filename, htmlWebpackPluginInstance, HtmlWebpackPlugin }).apply(compiler)
    })

    const ScriptPlugin = this.use(InjectEntryScriptWebpackPlugin)
    new ScriptPlugin(this.scriptPath).apply(compiler)

    /**
     * for javascript
     * generate variables getter script
     * replace variables holder
     */
    const Plugin = this.use(DynamicEnvsWebpackPlugin)
    new Plugin(emptyVariables, { globalThisProp: 'dynamicPublicPath' }).apply(compiler)
  }

  public apply(compiler: Compiler) {
    super.apply(compiler)
    this.applyPublicPath(compiler)
  }
}

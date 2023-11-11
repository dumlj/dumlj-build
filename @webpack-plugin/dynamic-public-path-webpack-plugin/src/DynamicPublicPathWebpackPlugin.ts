import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import { DynamicEnvsWebpackPlugin } from '@dumlj/dynamic-envs-webpack-plugin'
import { HtmlEnhanceWebpackPlugin, type TagProps } from '@dumlj/html-enhance-webpack-plugin'
import { InjectEntryScriptWebpackPlugin } from '@dumlj/inject-entry-script-webpack-plugin'
import HtmlWebpackPlugin, { type Options as HtmlWebpackPluginOptions } from 'html-webpack-plugin'
import type { Compiler } from 'webpack'
import { htmlify } from './utils/htmlify'
import { trimUrlPathEnd, trimUrlPath } from './utils/trimUrl'
import { PUBLIC_PATH_MODULE_SCRIPT_PATH } from './constants/conf'

export type PublicPaths = Record<
  string,
  | string
  | {
      /** 公共路径 */
      publicPath: string
      /** 额外环境变量 */
      envs?: Record<string, string>
      /** meta标签 */
      metaTags?: Array<Omit<TagProps, 'url' | 'content'>>
      /** 脚本标签 */
      scriptTags?: Array<string | TagProps>
      /** 样式标签 */
      styleTags?: Array<string | TagProps>
    }
>

export interface DynamicPublicPathWebpackPluginOptions extends SeedWebpackPluginOptions, HtmlWebpackPluginOptions {
  scriptPath?: string
}

export class DynamicPublicPathWebpackPlugin extends SeedWebpackPlugin<DynamicPublicPathWebpackPluginOptions> {
  static PLUGIN_NAME = 'dynamic-public-path-webpack-plugin'

  protected publicPath: string
  /** file/publicPath */
  protected publicPaths: Map<string, string>
  /** file/env */
  protected variables: Map<string, Record<string, string>>
  protected scriptPath: string
  protected metaTags: Map<string, Array<Omit<TagProps, 'url' | 'content'>>>
  protected scriptTags: Map<string, Array<string | TagProps>>
  protected styleTags: Map<string, Array<string | TagProps>>

  constructor(publicPaths: PublicPaths = {}, options?: DynamicPublicPathWebpackPluginOptions) {
    super(options)

    this.publicPaths = new Map()
    this.variables = new Map()
    this.scriptPath = options?.scriptPath || PUBLIC_PATH_MODULE_SCRIPT_PATH
    this.metaTags = new Map()
    this.scriptTags = new Map()
    this.styleTags = new Map()

    for (const [name, option] of Object.entries(publicPaths)) {
      const filename = htmlify(name)
      if (typeof option === 'string') {
        this.publicPaths.set(filename, option)
        continue
      }

      if (typeof option === 'object') {
        const { publicPath, envs, metaTags, scriptTags, styleTags } = option
        this.publicPaths.set(filename, publicPath)

        typeof envs === 'object' && this.variables.set(filename, envs)
        Array.isArray(metaTags) && this.metaTags.set(filename, metaTags)
        Array.isArray(scriptTags) && this.scriptTags.set(filename, scriptTags)
        Array.isArray(styleTags) && this.styleTags.set(filename, styleTags)
        continue
      }
    }
  }

  public applyPublicPath(compiler: Compiler) {
    const { options } = compiler

    /**
     * subfix default value is `/`
     * prefix default value is `''`
     */
    let subfix = typeof this.publicPath === 'string' ? trimUrlPath(this.publicPath) : ''
    subfix = subfix ? `/${subfix}/` : '/'

    // reset publicPath
    if (typeof options.output.publicPath === 'undefined') {
      options.output.publicPath = subfix
    }

    const emptyVariables: Record<string, void> = {}
    for (const [filename, prefix] of this.publicPaths) {
      // subfix 默认为 `/`, 而 prefix 默认为空字符串
      let publicPath = trimUrlPathEnd(prefix)
      publicPath = publicPath ? `${publicPath}` : ''
      publicPath = `${publicPath}${subfix}`

      const htmlWebpackPluginInstance = new HtmlWebpackPlugin({
        ...this.options,
        publicPath,
        filename,
      })

      htmlWebpackPluginInstance.apply(compiler)

      const variables = Object.assign({}, this.variables.get(filename), {
        // process.env.__DYNAMIC_PUBLIC_PATH__
        __DYNAMIC_PUBLIC_PATH__: publicPath,
      })

      const envs: Record<string, string> = {}
      for (const [name, value] of Object.entries(variables)) {
        emptyVariables[name] = undefined
        envs[name] = value
      }

      const metaTags = this.metaTags.get(filename)
      const styleTags = this.styleTags.get(filename)
      const scriptTags = this.scriptTags.get(filename)
      const Plugin = this.use(HtmlEnhanceWebpackPlugin)

      const instance = new Plugin({ htmlNS: filename, htmlWebpackPluginInstance, HtmlWebpackPlugin })
      instance.injectTags({ metaTags, styleTags, scriptTags })
      instance.injectVariables(envs, { globalThisProp: 'dynamicPublicPath' })
      instance.apply(compiler)
    }

    const ScriptPlugin = this.use(InjectEntryScriptWebpackPlugin)
    new ScriptPlugin(this.scriptPath).apply(compiler)

    /**
     * For javascript
     *
     * Generate variables getter script.
     * Replace variables placeholder.
     *
     * Because use DynamicEnvsWebpackPlugin,
     * we must use the prefix 'process.env.' as a variable placeholder
     */
    const Plugin = this.use(DynamicEnvsWebpackPlugin)
    new Plugin(emptyVariables, { globalThisProp: 'dynamicPublicPath' }).apply(compiler)
  }

  public apply(compiler: Compiler) {
    super.apply(compiler)
    this.applyPublicPath(compiler)
  }
}

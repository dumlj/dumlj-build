import { HtmlEnhanceWebpackPlugin, type HtmlEnhanceWebpackPluginOptions } from '@dumlj/html-enhance-webpack-plugin'
import { HtmlInjectTagsWebpackPlugin } from '@dumlj/html-inject-tags-webpack-plugin'
import { guid } from '@dumlj/util-lib'
import type { Compiler } from 'webpack'
import { makeEnvTagRenderer } from './utils/makeEnvTagRenderer'
import { GLOBAL_TARGET } from './constants/conf'

export interface HtmlInjectEnvsWebpackPluginOptions extends HtmlEnhanceWebpackPluginOptions {
  /** 存放环境变量的全局变量 */
  globalThis?: string
  /** 存放环境变量的全局变量属性名称 */
  globalThisProp?: string
  /** Script Tag ID */
  scriptTagId?: string
}

export class HtmlInjectEnvsWebpackPlugin extends HtmlEnhanceWebpackPlugin {
  static PLUGIN_NAME = 'html-inject-envs-webpack-plugin'

  public variables: Record<string, any>
  public globalThis?: string
  public globalThisProp?: string
  public scriptTagId?: string

  constructor(envs: Record<string, any>, options?: HtmlInjectEnvsWebpackPluginOptions) {
    super(options)
    this.options

    this.variables = envs
    this.globalThis = options?.globalThis || GLOBAL_TARGET
    this.globalThisProp = options?.globalThisProp || guid()
    this.scriptTagId = options?.scriptTagId || this.globalThisProp.toUpperCase()
  }

  public applyInjectEnvs(compiler: Compiler) {
    const renderEnvTag = makeEnvTagRenderer(this.globalThisProp, this.globalThis)
    const content = renderEnvTag`${JSON.stringify(this.variables)}`
    const Plugin = this.use(HtmlInjectTagsWebpackPlugin)
    const instance = new Plugin({
      ...this.options,
      scriptTags: [
        {
          content,
          location: 'prepend',
          attrs: {
            id: this.scriptTagId,
          },
        },
      ],
    })

    instance.apply(compiler)
  }

  public apply(compiler: Compiler) {
    super.apply(compiler)
    this.applyInjectEnvs(compiler)
  }
}

import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import { guid } from '@dumlj/util-lib'
import type HtmlWebpackPlugin from 'html-webpack-plugin'
import type { Compiler } from 'webpack'
import { makeEnvTagRenderer } from './utils/makeEnvTagRenderer'
import { htmlify } from './utils/htmlify'
import { GLOBAL_TARGET } from './constants/conf'

/** Tag 属性 */
export type TagAttrs = Record<string, string | boolean>

/**
 * Tag 位置
 * @description
 * 这里跟随 HtmlWebpackPlugin 输出，所以只有前后
 */
export type TagLocation = 'prepend' | 'append'

/** Tag 配置 */
export interface TagProps {
  url?: string
  attrs?: TagAttrs
  content?: string
  location?: TagLocation
}

export interface OverrideAsset {
  /** 额外 Tag */
  assetTags: {
    /** Script Tag */
    scripts: HtmlWebpackPlugin.HtmlTagObject[]
    /** Style Tag */
    styles: HtmlWebpackPlugin.HtmlTagObject[]
    /** Meta Tag */
    meta: HtmlWebpackPlugin.HtmlTagObject[]
  }
  /** 公共路径 */
  publicPath: string
  /** 输出名称 */
  outputName: string
  /** HtmlWebpackPlugin */
  plugin: HtmlWebpackPlugin
}

export type OverrideAssetCallback = (asset: OverrideAsset) => OverrideAsset

export interface InjectTagsOptions {
  /** Script Tag 配置集合 */
  scriptTags?: Array<string | TagProps>
  /** Link Tag 配置集合 */
  styleTags?: Array<string | TagProps>
  /** Meta Tag 配置集合 */
  metaTags?: Array<Omit<TagProps, 'url' | 'content'>>
}

export interface InjectVariablesOptions {
  /** 存放环境变量的全局变量 */
  globalThis?: string
  /** 存放环境变量的全局变量属性名称 */
  globalThisProp?: string
  /** Script Tag ID */
  scriptTagId?: string
}

/** 插件必要参数 */
export interface HtmlEnhanceWebpackPluginOptions extends SeedWebpackPluginOptions {
  /** 输出的 HTML 文件名 */
  htmlNS: string
  /**
   * HtmlWebpackPlugin 插件
   * 因为版本原因，所以请导入所用的 HtmlWebpackPlugin
   */
  HtmlWebpackPlugin: typeof HtmlWebpackPlugin
  /** HtmlWebpackPlugin 实例 */
  htmlWebpackPluginInstance: HtmlWebpackPlugin
}

export class HtmlEnhanceWebpackPlugin extends SeedWebpackPlugin<HtmlEnhanceWebpackPluginOptions> {
  static PLUGIN_NAME = 'html-enhance-webpack-plugin'

  protected overrides: Set<OverrideAssetCallback>

  public htmlNS: string
  public htmlWebpackPluginInstance
  public HtmlWebpackPlugin

  constructor(options: HtmlEnhanceWebpackPluginOptions) {
    super(options)

    this.overrides = new Set()

    const { htmlNS, HtmlWebpackPlugin: Plugin, htmlWebpackPluginInstance: instance } = this.dismantleHtmlWebpackPlugin(options)
    this.htmlNS = htmlNS
    this.htmlWebpackPluginInstance = instance
    this.HtmlWebpackPlugin = Plugin
  }

  public injectVariables(envs: Record<string, string>, options?: InjectVariablesOptions) {
    const globalThis = options?.globalThis || GLOBAL_TARGET
    const globalThisProp = options?.globalThisProp || guid()
    const scriptTagId = options?.scriptTagId || globalThisProp.toUpperCase()

    const renderEnvTag = makeEnvTagRenderer(globalThisProp, globalThis)
    const content = renderEnvTag`${JSON.stringify(envs)}`
    this.injectTags({
      scriptTags: [
        {
          content,
          location: 'prepend',
          attrs: {
            id: scriptTagId,
          },
        },
      ],
    })
  }

  public injectTags(options: InjectTagsOptions) {
    this.overrideAssets((data) => {
      const { metaTags, styleTags, scriptTags } = options
      if (Array.isArray(metaTags)) {
        metaTags.forEach((props) => {
          const { location, attrs } = props
          const tag = this.HtmlWebpackPlugin.createHtmlTagObject('meta', attrs)
          tag.voidTag = true
          location === 'prepend' ? data.assetTags.meta.unshift(tag) : data.assetTags.meta.push(tag)
        })
      }

      if (Array.isArray(styleTags)) {
        styleTags.forEach((props) => {
          const { location, url, attrs, content } = this.unifiedTagProps(props, { rel: 'stylesheet' })
          if (!url) {
            return
          }

          const tag = this.HtmlWebpackPlugin.createHtmlTagObject('link', { ...attrs, href: url }, content)
          location === 'prepend' ? data.assetTags.styles.unshift(tag) : data.assetTags.styles.push(tag)
        })
      }

      if (Array.isArray(scriptTags)) {
        scriptTags.forEach((props) => {
          const { location, url, attrs, content } = this.unifiedTagProps(props, { defer: true })
          const tag = this.HtmlWebpackPlugin.createHtmlTagObject('script', { ...attrs, src: url }, content)
          const finalLocation = typeof location === 'string' ? location : attrs?.defer === true ? 'prepend' : 'append'
          finalLocation === 'prepend' ? data.assetTags.scripts.unshift(tag) : data.assetTags.scripts.push(tag)
        })
      }

      return data
    })
  }

  /** 统一 Tag 属性 */
  protected unifiedTagProps(props: string | TagProps, defaultAttrs: TagAttrs = {}): TagProps {
    if (typeof props === 'string') {
      return { url: props, attrs: defaultAttrs }
    }

    return props
  }

  /** 替换静态资源 */
  public overrideAssets(override: OverrideAssetCallback) {
    this.overrides.add(override)
  }

  /** 将 HtmlWebpackPlugin 拆解成 htmlNS, HtmlWebpackPlugin, htmlWebpackPluginInstance */
  protected dismantleHtmlWebpackPlugin(params: Partial<Pick<HtmlEnhanceWebpackPluginOptions, 'htmlNS' | 'HtmlWebpackPlugin' | 'htmlWebpackPluginInstance'>>) {
    const { htmlWebpackPluginInstance } = params
    let { htmlNS, HtmlWebpackPlugin } = params

    const { filename } = htmlWebpackPluginInstance?.userOptions || {}
    htmlNS = htmlNS ? htmlNS : typeof filename === 'string' ? filename : 'index.html'

    HtmlWebpackPlugin = HtmlWebpackPlugin ? HtmlWebpackPlugin : Object.getPrototypeOf(htmlWebpackPluginInstance).constructor
    return { htmlNS, HtmlWebpackPlugin, htmlWebpackPluginInstance }
  }

  public apply(compiler: Compiler) {
    super.apply(compiler)

    compiler.hooks.compilation.tap(this.pluginName, (compilation) => {
      this.HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tap(this.pluginName, (data) => {
        if (data.outputName === htmlify(this.htmlNS)) {
          for (const override of this.overrides.values()) {
            if (typeof override === 'function') {
              data = override(data)
            }
          }

          return data
        }

        return data
      })
    })
  }
}

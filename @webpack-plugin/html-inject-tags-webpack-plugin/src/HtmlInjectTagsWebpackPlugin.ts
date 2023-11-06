import { HtmlEnhanceWebpackPlugin, type HtmlEnhanceWebpackPluginOptions } from '@dumlj/html-enhance-webpack-plugin'
import type { Compiler } from 'webpack'

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

export interface HtmlInjectTagsWebpackPluginOptions extends HtmlEnhanceWebpackPluginOptions {
  /** Script Tag 配置集合 */
  scriptTags?: Array<string | TagProps>
  /** Link Tag 配置集合 */
  styleTags?: Array<string | TagProps>
  /** Meta Tag 配置集合 */
  metaTags?: Array<Omit<TagProps, 'url' | 'content'>>
}

export class HtmlInjectTagsWebpackPlugin extends HtmlEnhanceWebpackPlugin {
  static PLUGIN_NAME = 'html-inject-tags-webpack-plugin'

  public scriptTags: Array<string | TagProps>
  public styleTags: Array<string | TagProps>
  public metaTags: Array<Omit<TagProps, 'url' | 'content'>>

  constructor(options?: HtmlInjectTagsWebpackPluginOptions) {
    super(options)

    this.metaTags = Array.isArray(options?.metaTags) ? options.metaTags : []
    this.scriptTags = Array.isArray(options?.scriptTags) ? options.scriptTags : []
    this.styleTags = Array.isArray(options?.styleTags) ? options.styleTags : []
  }

  /** 统一 Tag 属性 */
  protected unifiedTagProps(props: string | TagProps, defaultAttrs: TagAttrs = {}): TagProps {
    if (typeof props === 'string') {
      return { url: props, attrs: defaultAttrs }
    }

    return props
  }

  /** 注入 Tags */
  protected applyInjectTags(compiler: Compiler) {
    this.htmlWebpackPluginInstance && this.htmlWebpackPluginInstance.apply(compiler)

    this.overrideAssets(compiler, (data) => {
      this.scriptTags.forEach((props) => {
        const { location, url, attrs, content } = this.unifiedTagProps(props, { defer: true })
        const tag = this.HtmlWebpackPlugin.createHtmlTagObject('script', { ...attrs, src: url }, content)
        const finalLocation = typeof location === 'string' ? location : attrs?.defer === true ? 'prepend' : 'append'
        finalLocation === 'prepend' ? data.assetTags.scripts.unshift(tag) : data.assetTags.scripts.push(tag)
      })

      this.styleTags.forEach((props) => {
        const { location, url, attrs, content } = this.unifiedTagProps(props, { rel: 'stylesheet' })
        const tag = this.HtmlWebpackPlugin.createHtmlTagObject('link', { ...attrs, href: url }, content)
        location === 'prepend' ? data.assetTags.styles.unshift(tag) : data.assetTags.styles.push(tag)
      })

      this.metaTags.forEach((props) => {
        const { location, attrs } = props
        const tag = this.HtmlWebpackPlugin.createHtmlTagObject('meta', attrs)
        tag.voidTag = true
        location === 'prepend' ? data.assetTags.meta.unshift(tag) : data.assetTags.meta.push(tag)
      })

      return data
    })
  }

  public apply(compiler: Compiler) {
    super.apply(compiler)
    this.applyInjectTags(compiler)
  }
}

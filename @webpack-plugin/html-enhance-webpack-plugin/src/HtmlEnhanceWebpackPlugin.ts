import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import type HtmlWebpackPlugin from 'html-webpack-plugin'
import type { Compiler } from 'webpack'
import { htmlify } from './utils/htmlify'

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

  public htmlNS: string
  public htmlWebpackPluginInstance: HtmlWebpackPlugin
  public HtmlWebpackPlugin: typeof HtmlWebpackPlugin

  constructor(options: HtmlEnhanceWebpackPluginOptions) {
    super(options)

    const { htmlNS, HtmlWebpackPlugin: Plugin, htmlWebpackPluginInstance: instance } = this.dismantleHtmlWebpackPlugin(options)
    this.htmlNS = htmlNS
    this.htmlWebpackPluginInstance = instance
    this.HtmlWebpackPlugin = Plugin
  }

  /** 替换静态资源 */
  protected overrideAssets(compiler: Compiler, override: OverrideAssetCallback) {
    compiler.hooks.compilation.tap(this.pluginName, (compilation) => {
      this.HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tap(this.pluginName, (data) => {
        if (data.outputName === htmlify(this.htmlNS)) {
          return override(data)
        }

        return data
      })
    })
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
}

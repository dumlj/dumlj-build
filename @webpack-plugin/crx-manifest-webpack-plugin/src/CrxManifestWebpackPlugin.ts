import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import path from 'path'
import { defaultsDeep } from 'lodash'
import type { Compiler, Chunk } from 'webpack'
import { BACKGROUND_DEFAULT_FILE, POPUP_DEFAULT_FILE, CONTENT_SCRIPT_DEFAULT_FILE } from './constants/crx'

export interface ChromeContentScript {
  matches?: string[]
  css?: string[]
  js?: string[]
  run_at?: string
}

export interface WebAccessibleResource {
  resources: string[]
  matches: string[]
}

export interface ChromeManifest {
  name: string
  description: string
  version: string
  manifest_version: 3
  background?: {
    service_worker?: string
  }
  action?: {
    default_popup: string
  }
  content_scripts?: ChromeContentScript[]
  web_accessible_resources?: WebAccessibleResource[]
}

export interface CrxManifestWebpackPluginOptions extends SeedWebpackPluginOptions {
  /** 后台 JS 文件 */
  background?: string
  /** Popup HTML 文件 */
  popup?: string
  /** 注入的 JS 文件 */
  contentScript?: string
  /** 基础 Manifest */
  manifest?: ChromeManifest
}

export class CrxManifestWebpackPlugin extends SeedWebpackPlugin {
  static PLUGIN_NAME = 'crx-manifest-webpack-plugin'

  protected background: string
  protected popup: string
  protected contentScript: string
  protected manifest: ChromeManifest

  constructor(options?: CrxManifestWebpackPluginOptions) {
    super(options)

    const { background, popup, contentScript, manifest } = options || {}
    this.background = background || BACKGROUND_DEFAULT_FILE
    this.popup = popup || POPUP_DEFAULT_FILE
    this.contentScript = contentScript || CONTENT_SCRIPT_DEFAULT_FILE

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { name, description, version } = require(path.join(process.cwd(), 'package.json'))
    this.manifest = defaultsDeep({}, manifest, {
      name,
      description,
      version,
      manifest_version: 3,
    })
  }

  public apply(compiler: Compiler) {
    const { webpack } = compiler
    compiler.hooks.thisCompilation.tap(this.pluginName, (compilation) => {
      compilation.hooks.processAssets.tapPromise(this.pluginName, async () => {
        if (compilation.compiler.isChild()) {
          return
        }

        const manifest: ChromeManifest = defaultsDeep({}, this.manifest)
        const entryChunks = Array.from(compilation.entrypoints).reduce<Record<string, Chunk>>((entrypoints, [name, entrypoint]) => {
          entrypoints[name] = entrypoint.getEntrypointChunk()
          return entrypoints
        }, {})

        const matchEntry = (filename: string) => {
          const ext = path.extname(filename)
          const name = path.basename(filename).replace(ext, '')
          return Object.keys(entryChunks).includes(name)
        }

        if (matchEntry(this.background)) {
          manifest.background = {
            ...(manifest.background || {}),
            service_worker: this.background,
          }
        }

        if (matchEntry(this.popup)) {
          manifest.action = {
            ...(manifest.action || {}),
            default_popup: this.popup,
          }
        }

        if (matchEntry(this.contentScript)) {
          const name = this.contentScript.replace(path.extname(this.contentScript), '')
          const files = Array.from(entryChunks[name].files)
          const css = files.filter((file) => path.extname(file) === '.css')
          const js = files.filter((file) => path.extname(file) === '.js')

          manifest.content_scripts = [
            ...(manifest?.content_scripts || []),
            {
              matches: ['*://*/*'],
              css: css,
              js: js,
              run_at: 'document_idle',
            },
          ]
        }

        const assets = compilation.getAssets()
        const files = assets.map(({ name }) => name)
        if (Array.isArray(files) && files.length > 0) {
          manifest.web_accessible_resources = [
            ...(manifest?.web_accessible_resources || []),
            {
              matches: ['*://*/*'],
              resources: [...files],
            },
          ]
        }

        const source = JSON.stringify(manifest, null, 2)
        compilation.emitAsset('manifest.json', new webpack.sources.RawSource(source, false))
      })
    })
  }
}

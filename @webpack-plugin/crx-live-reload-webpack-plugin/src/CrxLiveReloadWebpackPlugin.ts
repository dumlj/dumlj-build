import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import path from 'path'
import type { IncomingMessage, ServerResponse } from 'http'
import type { Compiler } from 'webpack'
import type WebpackDevServer from 'webpack-dev-server'
import { SSE_HEADERS, SSE_SESSION_ID, SSE_RELOAD_TOKEN, SSE_SERVER_PATH } from './constants/sse'
import { BACKGROUND_DEFAULT_FILE, CONTENT_SCRIPT_DEFAULT_FILE, BACKGROUND_LIVERELOAD_SCRIPT_DEFAULT_FILE, CONTENT_SCRIPT_LIVERELOAD_SCRIPT_DEFAULT_FILE } from './constants/crx'
import type { SseResponse } from './types'

export interface Client {
  id: string
  res: ServerResponse
}

export interface CrxLiveReloadWebpackPluginParams {
  host?: string
  port?: number
  liveloadServer?: string
}

export interface CrxLiveReloadWebpackPluginOptions extends SeedWebpackPluginOptions {
  /** filename of background.js for chrome extension, default background.js */
  background?: string
  /** filename of contentScript.js for chrome extension, default contentScript.js */
  contentScript?: string
  backgroundLiveReloadScript?: string
  contentScriptReloadScript?: string
}

export class CrxLiveReloadWebpackPlugin extends SeedWebpackPlugin {
  static PLUGIN_NAME = 'crx-live-reload-webpack-plugin'

  protected clients: Client[]
  protected host: string
  protected port: number
  protected liveloadServer: string
  protected background: string
  protected contentScript: string
  protected backgroundLiveReloadScript: string
  protected contentScriptLiveReloadScript: string

  constructor(params?: CrxLiveReloadWebpackPluginParams, options?: CrxLiveReloadWebpackPluginOptions) {
    super(options)

    const { host = '0.0.0.0', port = 8182, liveloadServer } = params || {}
    const { background, contentScript, backgroundLiveReloadScript, contentScriptReloadScript } = options || {}

    this.clients = []
    this.host = host
    this.port = port
    this.liveloadServer = liveloadServer || `http://${this.host}:${this.port}/${SSE_SERVER_PATH}`
    this.background = background || BACKGROUND_DEFAULT_FILE
    this.contentScript = contentScript || CONTENT_SCRIPT_DEFAULT_FILE
    this.backgroundLiveReloadScript = backgroundLiveReloadScript || BACKGROUND_LIVERELOAD_SCRIPT_DEFAULT_FILE
    this.contentScriptLiveReloadScript = contentScriptReloadScript || CONTENT_SCRIPT_LIVERELOAD_SCRIPT_DEFAULT_FILE
  }

  /** 重写 DevServer */
  public applyOverrideDevServer(compiler: Compiler) {
    const liveReloadHandler = this.withCros((req, res) => {
      // 添加 Client
      const id = (Date.now() + Math.floor(Math.random() * 1e13)).toString(32)
      this.clients.push({ id, res })

      req.on('close', () => {
        const index = this.clients.findIndex((client) => client.id !== id)
        index !== -1 && this.clients.splice(index, 1)
      })

      // 设置内容
      const [, search] = req.url.split('?')
      const query = search.split('&').reduce<{ sid?: string }>((result, param) => {
        const [name, value] = param.split('=')
        return Object.assign(result, { [name]: value })
      }, {})

      /** 首次进入必须重置 */
      const reloadNow = SSE_SESSION_ID !== query?.sid
      const content = this.serializeMessage(reloadNow ? SSE_RELOAD_TOKEN : true)
      res.write(content)
    })

    const { setupMiddlewares } = compiler.options?.devServer || {}
    compiler.options.devServer = {
      ...compiler.options.devServer,
      setupMiddlewares(middlewares: any, devServer: WebpackDevServer) {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined')
        }

        if (typeof setupMiddlewares === 'function') {
          setupMiddlewares.call(this, devServer)
        }

        devServer.app.get(`/__livereload__`, liveReloadHandler)
        return middlewares
      },
    }
  }

  /** 注入模块 */
  public applyLiveReloadInject(compiler: Compiler) {
    const { webpack } = compiler
    const injectModule = (name: string, file: string) => {
      const entry = compiler.options.entry[name]
      if (Array.isArray(entry.import)) {
        entry.import.unshift(file)
      }
    }

    const getEntryName = (file: string) => {
      const name = path.basename(file)
      const ext = path.extname(file)
      return name.replace(ext, '')
    }

    Object.keys(compiler.options.entry).forEach((name) => {
      switch (name) {
        case getEntryName(this.background): {
          injectModule(name, this.backgroundLiveReloadScript)
          break
        }
        case getEntryName(this.contentScript): {
          injectModule(name, this.contentScriptLiveReloadScript)
          break
        }
      }
    })

    // 注入环境变量
    const variables = {
      'process.env.LIVERELOAD_SSE_URL': JSON.stringify(this.liveloadServer),
      'process.env.LIVERELOAD_SSE_SID': JSON.stringify(SSE_SESSION_ID),
      'process.env.LIVERELOAD_SSE_SERVER_PATH': JSON.stringify(SSE_SERVER_PATH),
    }

    const plugin = new webpack.DefinePlugin(variables)
    plugin.apply(compiler)
  }

  /** 注册服务 */
  public applyLiveReloadSender(compiler: Compiler) {
    compiler.hooks.afterDone.tap(this.pluginName, () => {
      this.sendMessage(SSE_RELOAD_TOKEN)
    })
  }

  /** 序列化通信数据 */
  protected serializeMessage(data: any) {
    const content: SseResponse = {
      success: true,
      code: 0,
      data,
    }

    return `data: ${JSON.stringify(content)}\n\n`
  }

  /** 发送消息 */
  protected sendMessage(message: any) {
    this.clients.forEach((client) => {
      const content = this.serializeMessage(message)
      client.res.write(content)
    })
  }

  /** 头部返回值 */
  protected withCros(callback: (req: IncomingMessage, res: ServerResponse) => void) {
    return (req: IncomingMessage, res: ServerResponse) => {
      const { origin } = req.headers || {}
      origin && res.setHeader('Access-Control-Allow-Origin', origin)
      res.writeHead(200, SSE_HEADERS)

      return callback(req, res)
    }
  }

  public apply(compiler: Compiler) {
    super.apply(compiler)

    this.applyOverrideDevServer(compiler)
    this.applyLiveReloadInject(compiler)
    this.applyLiveReloadSender(compiler)
  }
}

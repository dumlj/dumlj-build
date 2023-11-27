import path from 'path'
import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import type { Compiler } from 'webpack'

export interface InjectEntryScriptWebpackPluginOptions extends SeedWebpackPluginOptions {
  /** 位于另一个入口文件之后 */
  after?: string
  /** 上下文 */
  context?: string
}

export class InjectEntryScriptWebpackPlugin extends SeedWebpackPlugin {
  static PLUGIN_NAME = 'inject-entry-script-webpack-plugin'

  protected scriptPath: string
  protected after?: string

  constructor(scriptPath: string, options?: InjectEntryScriptWebpackPluginOptions) {
    super(options)

    this.scriptPath = scriptPath
    this.after = options?.after
  }

  /** prepend or append script to all entries */
  protected pushScriptToEntries(scriptPath: string, options?: InjectEntryScriptWebpackPluginOptions) {
    return <T>(entries: T): T => {
      const { after, context = process.cwd() } = options || {}
      for (const entry of Object.values(entries)) {
        if (!entry) {
          entry.import = [scriptPath]
        }

        if (typeof entry === 'object' && Object.keys(entry).length === 0) {
          entry.import = [path.join(context, './src/index')]
        }

        if (Array.isArray(entry.import) && -1 === entry.import.indexOf(scriptPath)) {
          if (typeof after === 'string') {
            const index = entry.import.indexOf(after)
            if (index !== -1) {
              entry.import.splice(index + 1, 0, scriptPath)
              return
            }
          }

          entry.import.unshift(scriptPath)
        }
      }

      return entries
    }
  }

  public applyInject(compiler: Compiler) {
    const { options, context } = compiler
    const pushScript = this.pushScriptToEntries(this.scriptPath, {
      after: this.after,
      context: context,
    })

    if (typeof options.entry === 'function') {
      const noConflit = options.entry
      options.entry = async function (this: any, ...args: any[]) {
        const entries = await noConflit.call(this, ...args)
        return pushScript(entries)
      }
    } else if (typeof options.entry === 'object') {
      options.entry = pushScript(options.entry)
    }

    return options
  }

  public apply(compiler: Compiler) {
    super.apply(compiler)
    this.applyInject(compiler)
  }
}

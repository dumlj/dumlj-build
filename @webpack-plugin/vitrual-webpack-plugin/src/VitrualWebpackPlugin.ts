import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import { fs, vol } from 'memfs'
import micromatch from 'micromatch'
import type { ValuesType } from 'utility-types'
import type { Compiler } from 'webpack'

export interface VitrualWebpackPluginOptions extends SeedWebpackPluginOptions {
  /** 读硬盘 */
  readFromDisk?: boolean
  /** 写硬盘 */
  writeToDisk?: boolean
  /** 初始时的文件 */
  files?: Record<string, string>
  /** 清除文件 */
  empty?: boolean
  /** 包含 */
  includeDisk?: string[]
}

export class VitrualWebpackPlugin extends SeedWebpackPlugin {
  static PLUGIN_NAME = 'vitrual-webpack-plugin'

  protected readFromDisk: boolean
  protected writeToDisk: boolean
  protected files: Record<string, string>
  protected includeDisk: string[]

  private originInputFs: Compiler['inputFileSystem']
  private originOutputFs: Compiler['outputFileSystem']

  static get files() {
    return vol.toJSON()
  }

  constructor(options?: VitrualWebpackPluginOptions) {
    super(options)

    const { files, readFromDisk = false, writeToDisk = false, includeDisk = ['**/node_modules/**'] } = options || {}
    this.readFromDisk = readFromDisk
    this.writeToDisk = writeToDisk
    this.includeDisk = includeDisk
    this.files = {
      ...(options?.empty ? {} : { 'src/index.js': '' }),
      ...files,
    }
  }

  public apply(compiler: Compiler) {
    super.apply(compiler)

    const { includeDisk } = this
    this.originInputFs = compiler.inputFileSystem
    this.originOutputFs = compiler.outputFileSystem

    type Method<T, M extends readonly string[]> = {
      [K in ValuesType<M>]: {
        [K1 in K]?: K extends keyof T ? T[K] : never
      }
    }[ValuesType<M>]

    const methods = ['lstat', 'readdir', 'stat', 'readFile', 'readJson', 'realpath', 'readlink', 'write', 'writeFile', 'unlink'] as const
    type APIs = Method<typeof compiler.inputFileSystem, typeof methods>

    if (this.readFromDisk === false) {
      const apis: APIs = {}
      for (const name of methods) {
        if (!(typeof compiler.inputFileSystem[name] === 'function' && typeof fs[name] === 'function')) {
          continue
        }

        apis[name] = (file: string, ...args: any[]) => {
          if (micromatch.isMatch(file, includeDisk, { dot: true, cwd: '/' })) {
            return this.originInputFs[name](file, ...args)
          }

          return fs[name](file, ...args)
        }
      }

      compiler.inputFileSystem = Object.assign({}, compiler.inputFileSystem, fs, apis)
    }

    if (this.writeToDisk === false) {
      const apis: APIs = {}
      for (const name of methods) {
        if (!(typeof compiler.outputFileSystem[name] === 'function' && typeof fs[name] === 'function')) {
          continue
        }

        apis[name] = (file: string, ...args: any[]) => {
          if (micromatch.isMatch(file, includeDisk)) {
            return this.originOutputFs[name](file, ...args)
          }

          return fs[name](file, ...args)
        }
      }

      compiler.outputFileSystem = Object.assign({}, fs, apis)
    }

    compiler.hooks.thisCompilation.tap(this.pluginName, () => {
      vol.reset()
      vol.fromJSON(this.files)
    })
  }
}

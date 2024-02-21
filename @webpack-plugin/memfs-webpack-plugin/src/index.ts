import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import { fs, vol } from 'memfs'
import micromatch from 'micromatch'
import type { ValuesType } from 'utility-types'
import type { Compiler } from 'webpack'

export interface MemfsWebpackPluginOptions extends SeedWebpackPluginOptions {
  /** 读硬盘 */
  readFromDisk?: boolean
  /** 写硬盘 */
  writeToDisk?: boolean
  /** 初始时的文件 */
  files?: Record<string, string>
  /** 清除文件 */
  empty?: boolean
  /** 包含 */
  include?: string[]
  /** 不包含 */
  exclude?: string[]
}

export class MemfsWebpackPlugin extends SeedWebpackPlugin {
  static PLUGIN_NAME = 'memfs-webpack-plugin'

  protected readFromDisk: boolean
  protected writeToDisk: boolean
  protected files: Record<string, string>
  protected include: string[]
  protected exclude: string[]

  private originInputFs?: Compiler['inputFileSystem']
  private originOutputFs?: Compiler['outputFileSystem']

  static get files() {
    return vol.toJSON()
  }

  constructor(options?: MemfsWebpackPluginOptions) {
    super(options)

    const { files, readFromDisk = false, writeToDisk = false, include = ['**/node_modules/**'], exclude = [] } = options || {}
    this.readFromDisk = readFromDisk
    this.writeToDisk = writeToDisk
    this.include = include
    this.exclude = exclude
    this.files = {
      ...(options?.empty ? {} : { 'src/index.js': '' }),
      ...files,
    }
  }

  public apply(compiler: Compiler) {
    super.apply(compiler)

    this.originInputFs = compiler.inputFileSystem
    this.originOutputFs = compiler.outputFileSystem

    type Method<T, M extends readonly string[]> = {
      [K in ValuesType<M>]: {
        [K1 in K]?: K extends keyof T ? T[K] : never
      }
    }[ValuesType<M>]

    const methods = ['lstat', 'readdir', 'stat', 'readFile', 'readJson', 'realpath', 'readlink', 'write', 'writeFile', 'unlink'] as const
    type APIs = Method<typeof compiler.inputFileSystem, typeof methods>
    type FileSystem = Compiler['inputFileSystem'] | Compiler['outputFileSystem']

    const virtualize = (fileSystem: FileSystem, originFileSystem: FileSystem) => {
      const apis: APIs = {}
      for (const name of methods) {
        if (!(typeof fileSystem[name] === 'function' && typeof fs[name] === 'function')) {
          continue
        }

        apis[name] = (file: string, ...args: any[]) => {
          if (micromatch.isMatch(file, this.include, { dot: true, cwd: '/' })) {
            return originFileSystem[name](file, ...args)
          }

          return fs[name](file, ...args)
        }
      }

      return Object.assign({}, fileSystem, fs, apis)
    }

    if (this.readFromDisk === false) {
      compiler.inputFileSystem = virtualize(compiler.inputFileSystem, this.originInputFs)
    }

    if (this.writeToDisk === false) {
      compiler.outputFileSystem = virtualize(compiler.outputFileSystem, this.originOutputFs)
    }

    compiler.hooks.thisCompilation.tap(this.pluginName, () => {
      vol.reset()
      vol.fromJSON(this.files)
    })
  }
}

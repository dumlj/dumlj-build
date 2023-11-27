import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import { execute } from '@dumlj/shell-lib'
import fs from 'fs-extra'
import path from 'path'
import Hjson from 'hjson'
import tarStream from 'tar-stream'
import { Writable } from 'stream'
import type { Compiler } from 'webpack'
import { compileDTS } from './share/compileDTS'
import { makeTsConfig } from './tsconfig'
import { renameForTypesProject } from './utils/renameForTypesProject'

export interface DtsWebpackPluginOptions extends SeedWebpackPluginOptions {
  /**
   * 输出的文件夹
   * @description
   * 默认为 typings
   */
  output?: string
  /**
   * 根目录相
   * @description
   * 默认读取 tsconfig.json 中的 compilerOptions.rootDir
   */
  rootDir?: string
  /**
   * 类型输出文件夹
   * @description
   * - 默认读取 tsconfig.json 中的 compilerOptions.declarationDir。
   * - 实际路径是 output + declarationDir + filename
   * - 只针对类型
   */
  declarationDir?: string
  /** tsconfig 配置文件 */
  tsconfig?: string
  /** 忽略文件 */
  ignore?: string[]
  /** 支持 ts 别名 */
  supportAlias?: boolean
  /**
   * 是否生成文件信息
   * @description
   * 默认开启
   */
  emitStats?: boolean
  /**
   * 是否生成项目
   * @description
   * 默认开启
   */
  emitProject?: boolean
  /**
   * 是否生成压缩包
   * @description
   * 默认关闭
   */
  emitTgz?: boolean
}

export class DtsWebpackPlugin extends SeedWebpackPlugin {
  static PLUGIN_NAME = 'dts-webpack-plugin'

  protected output: string
  protected rootDir: string
  protected declarationDir?: string
  protected tsconfig: string
  protected ignore: string[]
  protected supportAlias?: boolean
  protected emitStats?: boolean
  protected emitProject?: boolean
  protected emitTgz?: boolean
  /** 文件 */
  protected tsFiles: Set<string>

  constructor(options?: DtsWebpackPluginOptions) {
    super(options)

    const { output, rootDir, declarationDir, tsconfig, ignore, supportAlias, emitStats, emitProject, emitTgz } = options || {}
    this.output = typeof output === 'string' ? output : 'typings'
    this.rootDir = typeof rootDir === 'string' ? rootDir : undefined
    this.declarationDir = typeof declarationDir === 'string' ? declarationDir : undefined
    this.tsconfig = typeof tsconfig === 'string' ? tsconfig : 'tsconfig.json'
    this.ignore = Array.isArray(ignore) ? ignore : ['**/node_modules/**']
    this.supportAlias = typeof supportAlias === 'boolean' ? supportAlias : true
    this.emitStats = typeof emitStats === 'boolean' ? emitStats : true
    this.emitProject = typeof emitProject === 'boolean' ? emitProject : true
    this.emitTgz = typeof emitTgz === 'boolean' ? emitTgz : false
    this.tsFiles = new Set<string>()
  }

  /**
   * 预安装 ts-patch
   * 这里要使用到
   * @see https://github.com/nonara/ts-patch#setup
   */
  public applyPreinstallTsPatch(compiler: Compiler) {
    if (!this.supportAlias) {
      return
    }

    compiler.hooks.beforeRun.tapPromise(this.pluginName, async () => {
      const { peerDependencies } = await fs.readJson(path.join(__dirname, '../package.json'))
      const missingDependencies = Object.keys(peerDependencies).filter((name) => {
        try {
          require.resolve(name)
          return false
        } catch (error) {
          return true
        }
      })

      if (missingDependencies.length > 0) {
        this.logger.error(`Setting the option \`supportAlias: true\`, ${missingDependencies.map((name) => `\`${name}\``).join(' ')} must be installed first.`)
        return
      }

      await execute('ts-patch install -s')
    })
  }

  /** 收集 .ts 文件 */
  public applyCollectTsFiles(compiler: Compiler) {
    const extnames = ['.ts', '.tsx']
    compiler.resolverFactory.hooks.resolver.for('normal').tap('name', (resolver) => {
      resolver.hooks.result.tap(this.pluginName, (result) => {
        if (typeof result?.path === 'string' && extnames.includes(path.extname(result?.path))) {
          this.tsFiles.add(result.path)
        }

        return result
      })
    })
  }

  /** 执行编译 */
  public applyCompile(compiler: Compiler) {
    const { webpack } = compiler

    compiler.hooks.thisCompilation.tap(this.pluginName, (compilation) => {
      const archive: tarStream.Pack = this.emitTgz ? tarStream.pack() : null
      interface EmitAssetOptions {
        output?: string
        emitTgz?: boolean
      }

      const emitAsset = (file: string, content: string | Buffer, options?: EmitAssetOptions) => {
        const { output = this.output, emitTgz = this.emitTgz } = options || {}
        if (emitTgz) {
          archive.entry({ name: file }, content)
          return
        }

        const source = new webpack.sources.RawSource(content)
        compilation.emitAsset(path.join(output, file), source)
      }

      compilation.hooks.processAssets.tapPromise(this.pluginName, async () => {
        const files = Array.from(this.tsFiles)
        const tsconfig = path.isAbsolute(this.tsconfig) ? this.tsconfig : path.join(compiler.context, this.tsconfig)
        const content = await fs.readFile(tsconfig)

        /**
         * 带备注的配置文件内容
         * @description
         * 这里需要注意 tsconfig.json 是允许备注
         */
        const tsConfigContent = Hjson.parse(content.toString('utf-8'))
        const finalTsConfig = makeTsConfig(tsConfigContent, { supportAlias: this.supportAlias })

        const { compilerOptions } = finalTsConfig
        const { rootDir, declarationDir } = compilerOptions || {}
        const finalRootDir = this.rootDir || rootDir || compiler.context
        const finalDeclarationDir = this.declarationDir || declarationDir || ''

        const dtsMap = compileDTS(files, compilerOptions, {
          cwd: compiler.context,
          rootDir: finalRootDir,
        })

        const stats = []

        // 生成声明文件
        Object.keys(dtsMap).forEach((filename) => {
          const content = dtsMap[filename]
          const finalFile = path.join(finalDeclarationDir, filename)

          if (content) {
            emitAsset(finalFile, content)
            stats.push(filename)
          }
        })

        // 生成文件信息文件
        if (this.emitStats) {
          const content = JSON.stringify({ types: stats.map((filename) => path.join(finalDeclarationDir, filename)) })
          emitAsset('stats.json', content)
        }

        // 生成项目文件
        if (this.emitProject) {
          // 输出 package.json
          const content = await fs.readJson(path.join(compiler.context, 'package.json'))
          // 改写名称，生成声明项目
          // 一般项目 `@types/name`
          // 私域项目 `@types/scope__name`
          content.name = renameForTypesProject(content.name)
          emitAsset('package.json', JSON.stringify(content, null, 2))
        }

        if (this.emitTgz) {
          const generateAsync = () => {
            return new Promise<Buffer>((resolve, reject) => {
              archive.finalize()

              const content: Buffer[] = []
              const collecter = new Writable()
              collecter._write = () => {
                /* nothing todo... */
              }

              archive.on('data', (chunk: string | Buffer) => {
                const data = typeof chunk === 'string' ? Buffer.from(chunk) : chunk
                content.push(data)
              })

              archive.on('error', (error) => reject(error))
              archive.on('end', () => resolve(Buffer.concat(content)))
              archive.pipe(collecter)
            })
          }

          const buffer = await generateAsync()
          emitAsset(`${path.basename(this.output)}.tgz`, buffer, {
            emitTgz: false,
            output: '',
          })
        }
      })
    })
  }

  public apply(compiler: Compiler) {
    super.apply(compiler)
    this.applyPreinstallTsPatch(compiler)
    this.applyCollectTsFiles(compiler)
    this.applyCompile(compiler)
  }
}

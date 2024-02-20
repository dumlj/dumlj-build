import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import { Uploader, type InitParams, type UploadResponse } from '@dumlj/feature-uploader'
import chalk from 'chalk'
import { MultiBar, Presets } from 'cli-progress'
import fs from 'fs'
import path from 'path'
import trimEnd from 'lodash/trimEnd'
import micromatch from 'micromatch'
import { PassThrough } from 'stream'
import type { Compiler } from 'webpack'

export interface CdnUploadWebpackPluginOptions extends SeedWebpackPluginOptions {
  /**
   * prefix of path after uploading and excluding domain
   * @example
   * {
   *  prefix: '/20231030'
   * }
   * main.js => '/20231030/main.js'
   */
  prefix?: string
  /** OSS Upload Options */
  oss?: InitParams
  /** S3 Upload Options */
  s3?: InitParams
  /** Extra files to be uploaded */
  extraFiles?: Record<string, string>
  /** the pattern of excluding files */
  exclude?: string | string[]
}

export class CdnUploadWebpackPlugin extends SeedWebpackPlugin {
  static PLUGIN_NAME = 'cdn-upload-webpack-plugin'

  public prefix?: string
  public oss?: InitParams
  public s3?: InitParams
  public extraFiles: Record<string, string>
  public exclude?: string[]

  constructor(options?: CdnUploadWebpackPluginOptions) {
    super(options)

    const { prefix, oss, s3, extraFiles, exclude } = options || {}
    this.prefix = typeof prefix === 'string' ? trimEnd(prefix, '/') : ''
    this.oss = typeof oss === 'object' ? oss : undefined
    this.s3 = typeof s3 === 'object' ? s3 : undefined
    this.extraFiles = typeof extraFiles === 'object' ? extraFiles : {}
    this.exclude = Array.isArray(exclude) ? exclude : exclude ? [exclude] : []
  }

  protected isSkipOSS(options: InitParams) {
    const { bucket, region, accessKeyId, accessKeySecret } = options || {}
    return this.isSkipIncomplete('Skip OSS upload when lack of OSS options.', { bucket, region, accessKeyId, accessKeySecret })
  }

  protected isSkipS3(options: InitParams) {
    const { bucket, region, accessKeyId, accessKeySecret } = options || {}
    return this.isSkipIncomplete('Skip S3 upload when lack of S3 options.', { bucket, region, accessKeyId, accessKeySecret })
  }

  public apply(compiler: Compiler) {
    super.apply(compiler)

    /** 非正式环境也跳过 */
    if (process.env.NODE_ENV !== 'production') {
      this.logger.info('Skip non-production environments')
      return
    }

    if (this.oss && !this.isSkipOSS(this.oss)) {
      this.oss.bucket
      this.oss.region
      this.oss.responseHeaders
      new Uploader({
        // ...this.oss,
        type: 'oss',
        accessKeyId: this.oss.accessKeyId,
        accessKeySecret: this.oss.accessKeySecret,
        responseHeaders: this.oss.responseHeaders,
        bucket: this.oss.bucket,
        region: this.oss.region,
      })
    }

    const { options } = compiler
    const { output } = options
    const { prefix } = this
    const oss = this.oss && !this.isSkipOSS(this.oss) ? new Uploader({ ...this.oss, type: 'oss' }) : undefined
    const s3 = this.s3 && !this.isSkipS3(this.s3) ? new Uploader({ ...this.s3, type: 's3' }) : undefined
    const clients = [oss, s3].filter(Boolean) as Uploader[]
    const skipUpload = !(clients.length > 0 || this.verbose === true)

    // no upload configuration of s3 or oss, skip...
    if (skipUpload) {
      return
    }

    const uploadPromises: Promise<UploadResponse[]>[] = []
    const multiBar = new MultiBar(
      {
        barsize: 20,
        clearOnComplete: false,
        hideCursor: false,
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
      },
      Presets.legacy
    )

    const paddingSize = clients.map((client) => client.name.length).reduce((a, b) => (a > b ? a : b), 0)
    const namedClient = (name: string) => chalk.cyanBright(name.padStart(paddingSize)).toLocaleUpperCase()
    const formatProgressBar = (name: string, extras?: string[]) => {
      const client = namedClient(name)
      const process = `${Array.isArray(extras) ? extras.map((name) => `[${name}]`) : ''} [${chalk.cyanBright('{bar}')}]`
      const suffix = '{percentage}% {value}/{total}'
      return `[${client}]${process}${suffix}`
    }

    const generateProgressBar = (name: string, total: number, extras?: string[]) => {
      return multiBar.create(
        total,
        0,
        {},
        {
          format: formatProgressBar(name, extras),
          stopOnComplete: true,
        }
      )
    }

    const uploadedFiles: string[] = []
    compiler.hooks.thisCompilation.tap(this.pluginName, (compilation) => {
      compilation.hooks.afterProcessAssets.tap(this.pluginName, (compilationAssets) => {
        const assets = Object.entries(compilationAssets).filter(([filePath]) => !micromatch.isMatch(filePath, this.exclude, { dot: true }))

        if (!clients.length) {
          if (this.verbose) {
            const files = assets.map(([filePath]) => filePath).join('\n - ')
            this.logger.warn(`[VERBOSE] Matching uploaded files:\n - ${files}`)
          }

          return
        }

        clients.forEach((client) => {
          const progressBar = generateProgressBar(client.name, assets.length)

          /**
           * It will hide process-bar in TTY mode.
           * In fact, there is still a progress bar,
           * but I guess it has some wrong logical judgment
           * that lead to loss of the of total variable.
           *
           * 非 TTY 模式下进度条会隐藏, 实际上进度条还是有的, 但估计是判断错误, 而 total 并没有往下传递
           * 这里强制设置 Total
           *
           * @see https://github.com/npkgz/cli-progress/blob/f5aeca3e7ba692aff288542daf49164fa2378fdb/lib/multi-bar.js#L48
           */
          progressBar.setTotal(assets.length)

          const promises = assets.map(async ([filePath, source]) => {
            const bufferStream = new PassThrough()
            const content = source.source()
            const buffer = (() => {
              if (typeof content === 'string') {
                return Buffer.from(content)
              }

              return content
            })()

            const stream = bufferStream.end(buffer)
            const relativePath = path.join('.', filePath)
            const response = await client.parallelUpload(
              { file: relativePath, stream },
              {
                rootPath: output.path,
                directory: output.path,
                prefix,
              }
            )

            progressBar.increment(1)
            uploadedFiles.push(filePath)
            return response
          })

          const promise = Promise.all(promises)
          uploadPromises.push(promise)
        })
      })
    })

    compiler.hooks.afterEmit.tapPromise(this.pluginName, async (compilation) => {
      const extraFiles = Object.keys(this.extraFiles || {})
      // 保证必须为文件而非文件夹
      // Make sure files, not folders
      const isFilesMap = await Promise.all(
        extraFiles.map(async (file) => {
          return (await fs.existsSync(file)) && (await fs.promises.stat(file)).isFile()
        })
      )

      const outputDir = output.path || 'dist'
      const needUploadFiles = extraFiles.filter((_, index) => isFilesMap[index])
      if (needUploadFiles.length > 0) {
        const assets = compilation.getAssets().map(({ name }) => path.join(outputDir, name))
        const finalNeedUploadFiles = needUploadFiles.filter((file) => -1 === assets.indexOf(file))

        if (finalNeedUploadFiles.length > 0) {
          clients.forEach((client) => {
            const progressBar = generateProgressBar(client.name, finalNeedUploadFiles.length, ['Extra Files'])
            const promises = finalNeedUploadFiles.map(async (file) => {
              const stream = fs.createReadStream(file)
              // 产物地址
              const outpath = this.extraFiles[file]
              // 产物相对地址
              const relativePath = path.relative(outputDir, outpath)
              const response = await client.parallelUpload(
                { file: relativePath, stream },
                {
                  rootPath: output.path,
                  directory: output.path,
                  prefix,
                }
              )

              progressBar.increment(1)
              return response
            })

            uploadPromises.push(Promise.all(promises))
          })
        }
      }

      const responses = await Promise.all(uploadPromises)
      multiBar.stop()

      clients.forEach((client, index) => {
        const repsonse = responses[index]
        const name = client.name.toUpperCase()
        const files = repsonse.map(({ file, key }) => `[${name}] ${file} => ${key}`)
        this.logger.info(`Assets have been uploaded to ${name} completed. (total ${repsonse.length} files)\n${files.join('\n')}`)
      })
    })
  }
}

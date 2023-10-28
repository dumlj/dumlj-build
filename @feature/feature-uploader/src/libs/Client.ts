import { getType } from 'mime'
import progress from 'progress-stream'
import type { Readable } from 'stream'
import type { InitParams, UploadOptions, UploadResponse } from '../types'
import { isReadable } from '../utils/isReadable'
import { retry } from '../utils/retry'

export abstract class Client {
  static NAME: string
  protected abstract createService(options: Record<string, any>): any
  protected abstract _upload(stream: string | Buffer | Readable, options?: UploadOptions): Promise<UploadResponse>

  public bucket: string
  public region: string
  public accessKeyId: string
  public accessKeySecret: string

  public get name(): string {
    return Object.getPrototypeOf(this).constructor.NAME
  }

  constructor(params: InitParams) {
    const { bucket, region, accessKeyId, accessKeySecret } = params
    this.bucket = typeof bucket === 'string' ? bucket : undefined
    this.region = typeof region === 'string' ? region : undefined
    this.accessKeyId = typeof accessKeyId === 'string' ? accessKeyId : undefined
    this.accessKeySecret = typeof accessKeySecret === 'string' ? accessKeySecret : undefined
  }

  /** 获取文件类型 */
  protected getContentType(file: string) {
    return getType(file)
  }

  /** 上传内容 */
  public upload(content: string | Buffer | Readable, options?: UploadOptions): Promise<UploadResponse> {
    const { retryTimes, onRetry, onProgress, fileName, fileSize, fileKey } = options
    const fileInfo = { fileName, fileSize, fileKey }
    if (typeof onProgress === 'function') {
      const streamProgress = progress({
        length: fileSize,
        time: 100,
      })

      streamProgress.on('progress', (progress) => {
        onProgress(progress, fileInfo)
      })

      if (isReadable(content)) {
        content = content.pipe(streamProgress)
      }
    }

    return retry(() => this._upload(content, options), {
      retryTimes,
      onRetry(error, options) {
        if (typeof onRetry === 'function') {
          const { times } = options
          onRetry(error, { ...fileInfo, times })
        }
      },
    })()
  }
}

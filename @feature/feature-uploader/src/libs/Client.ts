import { getType } from 'mime'
import progress from 'progress-stream'
import type { Readable } from 'stream'
import type { InitParams, UploadOptions, UploadResponse } from '../types'
import { isReadable } from '../utils/isReadable'
import { retry } from '../utils/retry'

export type ClientUploadContent = string | Buffer | Readable
export type ClientUploadOptions<O extends Record<string, any>> = Pick<UploadOptions<O>, 'client' | 'fileName' | 'fileKey' | 'responseHeaders'>

export abstract class Client<O extends Record<string, any> = never> {
  protected abstract _upload(stream: ClientUploadContent, options?: ClientUploadOptions<O>): Promise<UploadResponse>

  static NAME: string

  public bucket?: string
  public region?: string
  public accessKeyId?: string
  public accessKeySecret?: string

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
    return getType(file) || undefined
  }

  /** 上传内容 */
  public upload(content: string | Buffer | Readable, options: UploadOptions<O>): Promise<UploadResponse> {
    const { retryTimes, onRetry, onProgress, fileName, fileKey, fileSize } = options
    const fileInfo = { fileName, fileKey, fileSize }
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
          const { times = 3 } = options || {}
          onRetry(error, { ...fileInfo, times })
        }
      },
    })()
  }
}

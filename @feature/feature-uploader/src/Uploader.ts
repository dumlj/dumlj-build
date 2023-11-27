import fs from 'fs'
import type { Readable } from 'stream'
import { OSSClient } from './clients/OSSClient'
import { S3Client } from './clients/S3Client'
import type { InitParams, UploadOptions, UploadResponse } from './types'
import type { CreateKeyOptions } from './utils/createKey'
import { createKey } from './utils/createKey'

/** 上传进度回调函数 */
export type UploaderProcess = (response: UploadResponse, index: number) => void

export interface UploaderParams extends InitParams {
  /** 客户端类型 */
  type?: 's3' | 'oss'
  /** 最大并发数 */
  maxConcurrency?: number
}

/** 上传内容 */
export type UploadSource =
  | string
  | {
      /** 文件名 */
      file: string
      /** 文件流 */
      stream: Readable
    }
  | {
      /** 文件名 */
      file: string
      /** 文件流 */
      content: string | Buffer
    }

/** 上传配置 */
export interface UploaderUploadOptions extends UploadOptions, CreateKeyOptions {}

/** 上传类 */
export class Uploader {
  protected client: S3Client | OSSClient
  protected maxConcurrency: number
  protected queue: Array<() => Promise<any>>
  protected uploading: Promise<any>

  public get name() {
    return this.client.name
  }

  constructor(params: UploaderParams) {
    const { type, maxConcurrency = 5, bucket, region, accessKeyId, accessKeySecret } = params || {}
    this.client =
      type === 's3' ? new S3Client({ bucket, region, accessKeyId, accessKeySecret }) : type === 'oss' ? new OSSClient({ bucket, region, accessKeyId, accessKeySecret }) : undefined
    this.maxConcurrency = typeof maxConcurrency === 'number' && !isNaN(maxConcurrency) && Number.isSafeInteger(maxConcurrency) && maxConcurrency > 0 ? maxConcurrency : 5
    this.queue = []
  }

  /** 上传 */
  public async upload(source: UploadSource, options?: UploaderUploadOptions): Promise<UploadResponse> {
    if (typeof source === 'string') {
      const stream = fs.createReadStream(source)
      return this.upload({ file: source, stream }, options)
    }

    const { file } = source
    const content = 'stream' in source ? source.stream : source.content
    const key = createKey(file, options)
    const finalOptions = Object.assign<UploaderUploadOptions, UploaderUploadOptions, UploaderUploadOptions>({}, options, { fileName: file, fileKey: key })
    return this.client.upload(content, finalOptions)
  }

  /** 创建并发上传任务 */
  public async parallelUpload(source: UploadSource, options?: UploaderUploadOptions): Promise<UploadResponse> {
    return new Promise<UploadResponse>(async (resolve) => {
      this.queue.push(async () => {
        const repsonse = await this.upload(source, options)
        resolve(repsonse)
        return repsonse
      })

      this.bootstrap()
    })
  }

  /** 执行队列 */
  public async bootstrap() {
    const { maxConcurrency } = this
    const tasksInQueue = this.queue.splice(0)

    const next = async (tasks = []) => {
      // 没有任务则退出
      if (tasksInQueue.length === 0) {
        this.uploading = undefined
        return
      }

      // 下一次能上传最大的任务书
      const nextSize = maxConcurrency - tasks.length
      if (nextSize === 0) {
        await this.uploading
      }

      // 找出能上传的任务并其出栈
      tasksInQueue.splice(0, nextSize).map(async (fn) => {
        const promise = fn()
        tasks.push(
          promise.then((response) => {
            // 如果完成则将 promise 从 uploading 队列出栈
            const uploadingIndex = tasks.indexOf(promise)
            uploadingIndex !== -1 && tasks.splice(uploadingIndex, 1)
            return response
          })
        )
      })

      // 只要有一个任务完成则可以进行下一次入栈上传
      await Promise.race(tasks)
      return next(tasks)
    }

    return next()
  }
}

import { config, S3, SharedIniFileCredentials } from 'aws-sdk'
import type { Readable } from 'stream'
import { RESPONSE_HEADERS } from '../constants/headers'
import { Client } from '../libs/Client'
import type { UploadOptions, UploadResponse } from '../types'

export class S3Client extends Client {
  static NAME = 's3'
  protected s3: S3

  /** 注册证书 */
  protected registerCredentials(accessKeyId: string, accessKeySecret: string) {
    return new Promise<void>(async (resolve, reject) => {
      const SecretSharedIniFileCredentials = class extends SharedIniFileCredentials {
        public load(callback: (error: Error) => any) {
          this.accessKeyId = accessKeyId
          this.secretAccessKey = accessKeySecret
          callback(null)
        }
      }

      const credentials = new SecretSharedIniFileCredentials({
        callback(error) {
          if (error) {
            reject(error)
            return
          }

          config.credentials = credentials
          resolve()
        },
      })
    })
  }

  /** 创建服务 */
  protected async createService(config?: Partial<S3.ClientConfiguration>) {
    const { region, accessKeyId = process.env.S3_AK, accessKeySecret = process.env.S3_SK } = this
    await this.registerCredentials(accessKeyId, accessKeySecret)
    return new S3(Object.assign({ logger: undefined }, config, { region }))
  }

  /** 上传 */
  protected async _upload(stream: string | Buffer | Readable, options?: Pick<UploadOptions, 'fileName' | 'fileKey' | 'responseHeaders'>) {
    this.s3 = this.s3 || (await this.createService())
    return new Promise<UploadResponse>(async (resolve, reject) => {
      const { bucket } = this
      const { fileName, fileKey, responseHeaders } = options || {}
      const { ['Cache-Control']: CacheControl } = Object.assign({}, RESPONSE_HEADERS, responseHeaders)

      const ContentType = this.getContentType(fileName)
      const uploadParams: S3.Types.PutObjectRequest = {
        Body: stream,
        Bucket: bucket,
        Key: fileKey,
        ContentType,
        CacheControl,
      }

      this.s3.upload(uploadParams, (error, data) => {
        if (error) {
          reject(error)
          return
        }

        const { Key } = data
        resolve({ file: fileName, key: Key, contentType: ContentType })
      })
    })
  }
}

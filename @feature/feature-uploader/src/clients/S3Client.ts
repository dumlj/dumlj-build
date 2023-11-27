import { S3Client as S3, type S3ClientConfig } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import type { Readable } from 'stream'
import { RESPONSE_HEADERS } from '../constants/headers'
import { Client } from '../libs/Client'
import type { UploadOptions } from '../types'
import type { DeepPartial } from 'utility-types'

export class S3Client extends Client<Partial<S3ClientConfig>> {
  static NAME = 's3'
  protected s3: S3

  /** 创建服务 */
  protected async createService(config?: DeepPartial<S3ClientConfig>) {
    const { region, accessKeyId = process.env.S3_AK, accessKeySecret = process.env.S3_SK } = this
    return new S3({
      ...(config as any),
      region,
      credentials: {
        ...(config?.credentials as any),
        accessKeyId,
        secretAccessKey: accessKeySecret,
      },
    })
  }

  protected async _upload(stream: string | Buffer | Readable, options?: Pick<UploadOptions, 'client' | 'fileName' | 'fileKey' | 'responseHeaders'>) {
    this.s3 = this.s3 || (await this.createService(options?.client))

    const { bucket } = this
    const { fileName, fileKey, responseHeaders } = options || {}
    const { ['Cache-Control']: CacheControl } = Object.assign({}, RESPONSE_HEADERS, responseHeaders)

    const ContentType = this.getContentType(fileName)
    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: bucket,
        Key: fileKey,
        Body: stream,
        ContentType,
        CacheControl,
      },
    })

    await upload.done()

    const Key = fileKey
    return { file: fileName, key: Key, contentType: ContentType }
  }
}

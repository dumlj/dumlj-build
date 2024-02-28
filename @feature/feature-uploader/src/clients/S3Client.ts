import { S3Client as S3, type S3ClientConfig } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { RESPONSE_HEADERS } from '../constants/headers'
import { Client, type ClientUploadContent, type ClientUploadOptions } from '../libs/Client'

type CreateServiceOptions = Omit<S3ClientConfig, 'region' | 'credentials'> & {
  credentials?: Omit<S3ClientConfig['credentials'], 'accessKeyId' | 'secretAccessKey'>
}

export class S3Client extends Client<Partial<S3ClientConfig>> {
  static NAME = 's3'
  protected s3!: S3

  /** 创建服务 */
  protected async createService(config?: CreateServiceOptions) {
    const { region, accessKeyId = process.env.S3_AK!, accessKeySecret = process.env.S3_SK! } = this
    return new S3({
      ...config,
      region,
      credentials: {
        ...config?.credentials,
        accessKeyId,
        secretAccessKey: accessKeySecret,
      },
    })
  }

  protected async _upload(stream: ClientUploadContent, options: ClientUploadOptions<Partial<S3ClientConfig>>) {
    this.s3 = this.s3 || (await this.createService(options.client))

    const { bucket } = this
    const { fileName, fileKey, responseHeaders } = options
    const { ['Cache-Control']: CacheControl } = Object.assign({}, RESPONSE_HEADERS, responseHeaders)

    const ContentType = fileName ? this.getContentType(fileName) : undefined
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

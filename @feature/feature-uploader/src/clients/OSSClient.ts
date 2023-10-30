import OSS from 'ali-oss'
import type { Readable } from 'stream'
import { RESPONSE_HEADERS } from '../constants/headers'
import { Client } from '../libs/Client'
import { isReadable } from '../utils/isReadable'
import type { UploadOptions } from '../types'

/**
 * 阿里云上传工具
 * @see [出现跨域问题](https://help.aliyun.com/document_detail/40130.html)
 */
export class OSSClient extends Client<Partial<OSS.Options>> {
  static NAME = 'oss'
  protected oss?: OSS

  /** 创建服务 */
  protected createService(options?: Partial<OSS.Options>) {
    const { region, bucket, accessKeyId = process.env.OSS_AK, accessKeySecret = process.env.OSS_SK } = this || {}
    return new OSS(Object.assign({}, options, { region, bucket, accessKeyId, accessKeySecret }))
  }

  /** 上传 */
  protected async _upload(content: string | Buffer | Readable, options?: Pick<UploadOptions, 'client' | 'fileName' | 'fileKey' | 'responseHeaders'>) {
    this.oss = this.oss || this.createService(options?.client)

    const { fileName, fileKey, responseHeaders = {} } = options || {}
    const contentType = this.getContentType(fileName)
    const { ['Cache-Control']: CacheControl } = Object.assign({}, RESPONSE_HEADERS, responseHeaders)

    if (isReadable(content)) {
      /**
       * 上传配置
       * @description
       * 里面的参数虽然是必填, 实际源码都可以选填, 这里估计是 TS 声明写错了
       */
      const putStreamOptions: Partial<OSS.PutStreamOptions> = {
        headers: {
          'Cache-Control': CacheControl,
          ...responseHeaders,
        },
      }

      const response = await this.oss.putStream(fileKey, content, putStreamOptions as OSS.PutStreamOptions)
      const { name, res } = response || {}
      if (!(typeof name === 'string' && 200 <= res?.status && res?.status < 400)) {
        throw new Error(`upload failed. ${response?.toString()}`)
      }
    } else {
      /**
       * 上传配置
       * @description
       * 里面的参数虽然是必填, 实际源码都可以选填, 这里估计是 TS 声明写错了
       */
      const putOptions: Partial<OSS.PutObjectOptions> = {
        headers: {
          'Cache-Control': CacheControl,
          ...responseHeaders,
        },
      }

      const response = await this.oss.put(fileKey, content, putOptions as OSS.PutObjectOptions)
      const { name, res } = response || {}
      if (!(typeof name === 'string' && 200 <= res?.status && res?.status < 400)) {
        throw new Error(`upload failed. ${response?.toString()}`)
      }
    }

    return { file: fileName, key: fileKey, contentType }
  }
}

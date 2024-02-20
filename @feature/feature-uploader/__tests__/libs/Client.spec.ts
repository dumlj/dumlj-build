import { Client } from '@/libs/Client'
import type { Readable } from 'stream'
import type { UploadOptions } from '@/types'

describe('test libs/Client', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.spyOn(global, 'setTimeout')
  })

  it('can be inherited and custom upload logic', async () => {
    const bucket = 'bucket'
    const region = 'region'
    const accessKeyId = 'accessKeyId'
    const accessKeySecret = 'accessKeySecret'

    const upload = jest.fn(async (stream: string | Buffer | Readable, options: UploadOptions) => {
      const { fileKey, fileName } = options
      return {
        file: fileName,
        key: fileKey,
        contentType: typeof stream,
      }
    })

    class CustomClient extends Client {
      _upload(stream: string | Buffer | Readable, options: UploadOptions) {
        return upload(stream, options)
      }
    }

    const client = new CustomClient({ bucket, region, accessKeyId, accessKeySecret })
    const response = await client.upload('hello', { fileKey: '20231030', fileName: 'main.js' })
    expect(response.key).toEqual('20231030')
    expect(response.file).toEqual('main.js')
    expect(response.contentType).toEqual('string')
    expect(upload).toHaveBeenCalled()
  })

  it('can be retry upload by custom times', async () => {
    const bucket = 'bucket'
    const region = 'region'
    const accessKeyId = 'accessKeyId'
    const accessKeySecret = 'accessKeySecret'
    const upload = jest.fn(() => Promise.reject(new Error('some errors')))

    class CustomClient extends Client {
      _upload() {
        return upload()
      }
    }

    const client = new CustomClient({ bucket, region, accessKeyId, accessKeySecret })
    const { rejects: handleRejects } = expect(
      client.upload('hello', {
        fileKey: '20231030',
        fileName: 'main.js',
        /**
         * The first time is the current execution,
         * and the retries failed 3 times,
         * a total of 4 times.
         */
        retryTimes: 3,
        onRetry: async () => {
          await Promise.resolve()
          /**
           * setTimeout is executed after onRetry in the catch callback,
           * so it must be called after Promise.resolve.
           */
          jest.runAllTimers()
        }
      })
    )

    await handleRejects.toThrowError('some error')
    expect(upload).toHaveBeenCalledTimes(3 + 1)
  })
})

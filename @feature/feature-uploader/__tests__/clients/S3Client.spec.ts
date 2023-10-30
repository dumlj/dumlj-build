import path from 'path'
import { vol } from 'memfs'
import { S3Client } from '@/clients/S3Client'

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
jest.mock('@aws-sdk/lib-storage')

describe('test clients/S3Client', () => {
  beforeAll(async () => {
    const { Upload } = await import('@aws-sdk/lib-storage')
    interface UploadConfig {
      params: {
        Key: string
        Body: string
      }
    }

    jest.isMockFunction(Upload) &&
      Upload.mockImplementation((config: UploadConfig) => ({
        async done() {
          const { params } = config || {}
          const { Key, Body } = params || {}
          const finalKey = Key || `${Date.now()}.js`

          vol.writeFileSync(path.join('/', Key), Body)
          return { Key: finalKey }
        },
      }))
  })

  it('can upload something...', async () => {
    const bucket = 'bucket'
    const region = 'region'
    const accessKeyId = 'accessKeyId'
    const accessKeySecret = 'accessKeySecret'
    const s3 = new S3Client({ bucket, region, accessKeyId, accessKeySecret })
    const response = await s3.upload('hello world', { fileName: 'a.js', fileKey: 'a.hash.js' })

    expect(response).toEqual({
      file: 'a.js',
      key: 'a.hash.js',
      contentType: 'application/javascript',
    })

    expect(vol.existsSync('/a.hash.js')).toBeTruthy()
    expect(vol.readFileSync('/a.hash.js', { encoding: 'utf-8' })).toEqual('hello world')
  })
})

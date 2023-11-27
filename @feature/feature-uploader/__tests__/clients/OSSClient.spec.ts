import path from 'path'
import { vol } from 'memfs'
import { OSSClient } from '@/clients/OSSClient'

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
jest.mock('ali-oss')

describe('test clients/OSSClient', () => {
  beforeAll(async () => {
    const OSS = await import('ali-oss')
    const upload = async (fileKey: string, content: string) => {
      const name = fileKey || `${Date.now()}.js`

      vol.writeFileSync(path.join('/', fileKey), content)
      const res = { status: 200 }
      return { name, res }
    }

    jest.isMockFunction(OSS) &&
      OSS.mockImplementation(() => ({
        putStream: upload,
        put: upload,
      }))
  })

  it('can upload something...', async () => {
    const bucket = 'bucket'
    const region = 'region'
    const accessKeyId = 'accessKeyId'
    const accessKeySecret = 'accessKeySecret'
    const oss = new OSSClient({ bucket, region, accessKeyId, accessKeySecret })
    const response = await oss.upload('hello world', { fileName: 'a.js', fileKey: 'a.hash.js' })

    expect(response).toEqual({
      file: 'a.js',
      key: 'a.hash.js',
      contentType: 'application/javascript',
    })

    expect(vol.existsSync('/a.hash.js')).toBeTruthy()
    expect(vol.readFileSync('/a.hash.js', { encoding: 'utf-8' })).toEqual('hello world')
  })
})

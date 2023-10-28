import { SeedWebpackPlugin } from '@dumlj/seed-webpack-plugin'
import { mockWebpack } from '@dumlj/mock-lib'
import path from 'path'
import { vol } from 'memfs'
import { CrxManifestWebpackPlugin } from '@/CrxManifestWebpackPlugin'

describe('test CrxManifestWebpackPlugin', () => {
  const webpack = mockWebpack({
    '/index.js': 'console.log("hi world")',
  })

  it('can be inherited by seed plugin.', async () => {
    const instance = new CrxManifestWebpackPlugin()
    expect(instance).toBeInstanceOf(SeedWebpackPlugin)
  })

  it('can emit manifest.json assets', async () => {
    const { compiler } = await webpack({
      plugins: [new CrxManifestWebpackPlugin()],
    })

    const manifest = path.join(compiler.context, 'manifest.json')
    expect(vol.existsSync(manifest)).toBeTruthy()

    const content = vol.readFileSync(manifest).toString('utf-8')
    expect(() => JSON.parse(content)).not.toThrowError()

    const json = JSON.parse(content)
    /* eslint-disable-next-line @typescript-eslint/no-var-requires */
    const { name, description, version } = require(path.join(__dirname, '../../../package.json'))
    expect(json).toHaveProperty('name', name)
    expect(json).toHaveProperty('description', description)
    expect(json).toHaveProperty('version', version)
    expect(json).toHaveProperty('manifest_version')
    expect(json).toHaveProperty('web_accessible_resources')
  })
})

import { SeedWebpackPlugin } from '@dumlj/seed-webpack-plugin'
import { mockWebpack } from '@dumlj/mock-lib'
import path from 'path'
import { vol } from 'memfs'
import JSZip from 'jszip'
import { ZipWebpackPlugin } from '@/ZipWebpackPlugin'

describe('test ZipWebpackPlugin', () => {
  const webpack = mockWebpack({
    '/index.js': 'console.log("hi world")',
  })

  it('can be inherited by seed plugin.', async () => {
    const instance = new ZipWebpackPlugin()
    expect(instance).toBeInstanceOf(SeedWebpackPlugin)
  })

  it('is will push outdate plugin.', async () => {
    const zipFile = 'main.zip'
    const mainFile = 'main.js'

    const { compiler } = await webpack({
      plugins: [
        new ZipWebpackPlugin({
          output: zipFile,
        }),
      ],
    })

    const { context } = compiler
    const absZipFile = path.join(context, zipFile)
    expect(vol.existsSync(absZipFile)).toBeTruthy()

    const buffer = vol.readFileSync(absZipFile)
    const jszip = new JSZip()
    const zip = await jszip.loadAsync(buffer)
    expect(Object.keys(zip.files).includes(mainFile))

    const code = await zip.files[mainFile].async('text')
    expect(code).toEqual(vol.readFileSync(path.join(context, mainFile), { encoding: 'utf-8' }))
  })
})

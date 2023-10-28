import path from 'path'
import { SeedWebpackPlugin } from '@dumlj/seed-webpack-plugin'
import { mockWebpack } from '@dumlj/mock-lib'
import { PrettyAssetsTreeWebpackPlugin } from '@/PrettyAssetsTreeWebpackPlugin'
import { type Compiler } from 'webpack'

describe('test PrettyAssetsTreeWebpackPlugin', () => {
  const noConflitLog = global.console.log
  afterEach(() => {
    global.console.log = noConflitLog
  })

  const webpack = mockWebpack({
    '/index.js': 'console.log("hi world")',
  })

  it('can be inherited by seed plugin.', async () => {
    const instance = new PrettyAssetsTreeWebpackPlugin()
    expect(instance).toBeInstanceOf(SeedWebpackPlugin)
  })

  it('is will push outdate plugin.', async () => {
    const messages: string[] = []
    global.console.log = jest.fn((...message) => {
      messages.push(message.join(''))
    })

    await webpack({
      context: __dirname,
      mode: 'production',
      output: {
        path: path.join(__dirname, 'dist'),
      },
      plugins: [
        new PrettyAssetsTreeWebpackPlugin(),
        {
          apply(compiler: Compiler) {
            const { webpack } = compiler
            compiler.hooks.thisCompilation.tap('emit-assets', (compilation) => {
              compilation.hooks.processAssets.tap('emit-assets', () => {
                compilation.emitAsset('constants/conf.js', new webpack.sources.RawSource(''))
                compilation.emitAsset('services/echo.js', new webpack.sources.RawSource(''))
                compilation.emitAsset('utils/find.js', new webpack.sources.RawSource(''))
                compilation.emitAsset('utils/each.js', new webpack.sources.RawSource(''))
                compilation.emitAsset('hello.js', new webpack.sources.RawSource(''))
              })
            })
          },
        },
      ],
    })

    global.console.log = noConflitLog

    expect(messages).toEqual([
      '\n' +
        '\n' +
        '┌ \x1B[37mdist\x1B[39m\n' +
        '├─┬ \x1B[34mconstants\x1B[39m\n' +
        '│ └─── \x1B[32mconf.js\x1B[39m \x1B[90mdist/constants/conf.js\x1B[39m\n' +
        '├─┬ \x1B[34mservices\x1B[39m\n' +
        '│ └─── \x1B[32mecho.js\x1B[39m \x1B[90mdist/services/echo.js\x1B[39m\n' +
        '├─┬ \x1B[34mutils\x1B[39m\n' +
        '│ ├─── \x1B[32meach.js\x1B[39m \x1B[90mdist/utils/each.js\x1B[39m\n' +
        '│ └─── \x1B[32mfind.js\x1B[39m \x1B[90mdist/utils/find.js\x1B[39m\n' +
        '├── \x1B[32mmain.js\x1B[39m \x1B[90mdist/main.js\x1B[39m\n' +
        '└── \x1B[32mhello.js\x1B[39m \x1B[90mdist/hello.js\x1B[39m\n',
    ])
  })
})

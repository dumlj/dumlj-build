import path from 'path'
import { SeedWebpackPlugin } from '@dumlj/seed-webpack-plugin'
import { mockWebpack } from '@dumlj/mock-lib'
import { PrettyAssetsTreeWebpackPlugin } from '@/PrettyAssetsTreeWebpackPlugin'
import chalk from 'chalk'
import { type Compiler } from 'webpack'

describe('test PrettyAssetsTreeWebpackPlugin', () => {
  const noConflitLog = global.console.log
  afterEach(() => {
    global.console.log = noConflitLog
    chalk.level = 3
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

    chalk.level = 0

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
        '┌ dist\n' +
        '├─┬ constants\n' +
        '│ └─── conf.js dist/constants/conf.js\n' +
        '├─┬ services\n' +
        '│ └─── echo.js dist/services/echo.js\n' +
        '├─┬ utils\n' +
        '│ ├─── each.js dist/utils/each.js\n' +
        '│ └─── find.js dist/utils/find.js\n' +
        '├── main.js dist/main.js\n' +
        '└── hello.js dist/hello.js\n',
    ])
  })
})

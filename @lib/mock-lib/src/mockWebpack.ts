import { fs, vol } from 'memfs'
import type { Compiler } from 'webpack'
import webpack from 'webpack'

export const mockWebpack = (files: Record<string, string>) => (webpackOptions?: webpack.Configuration) => {
  const { context = `/${Math.floor(Math.random() * 1e13).toString(32)}` } = webpackOptions

  const compiler = webpack({
    context,
    entry: ['/index.js'],
    output: {
      path: context,
    },
    ...webpackOptions,
  })

  // mock fs system
  compiler.inputFileSystem = fs
  compiler.outputFileSystem = fs

  // mock files
  vol.fromJSON(
    Object.keys(files).reduce((vol, path) => {
      vol[`${context}/${path}`] = files[path]
      return vol
    }, {})
  )

  return new Promise<{ compiler: Compiler; stats: webpack.Stats }>((resolve, reject) => {
    compiler.run((error, stats) => {
      if (error) {
        reject(error)
        return
      }

      if (stats.hasErrors()) {
        reject(stats.toString())
        return
      }

      resolve({ compiler, stats })
    })
  })
}

afterEach(() => {
  vol.reset()
})

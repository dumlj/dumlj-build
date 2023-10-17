import path from 'path'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { StackblitzWebpackPlugin } from '@dumlj/stackblitz-webpack-plugin'

export interface StackblitzOptions {
  cwd: string
}

export const stackblitz = async (options?: StackblitzOptions) => {
  const { cwd = process.cwd() } = options || {}
  const compiler = webpack({
    mode: 'development',
    context: cwd,
    entry: path.join(__dirname, 'index'),
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '../../public/index.html'),
      }),
      new StackblitzWebpackPlugin(),
    ],
  })

  const server = new WebpackDevServer(
    {
      host: '0.0.0.0',
      port: 3000,
    },
    compiler
  )

  await server.start()
}

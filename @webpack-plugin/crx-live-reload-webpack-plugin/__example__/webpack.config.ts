import path from 'path'
import { type Configuration } from 'webpack'
import { VitrualWebpackPlugin } from '@dumlj/vitrual-webpack-plugin'
import { CrxLiveReloadWebpackPlugin } from '@dumlj/crx-live-reload-webpack-plugin'

const CONFIG: Configuration = {
  mode: 'development',
  // devServer: {
  //   devMiddleware: {
  //     writeToDisk: true,
  //   },
  // },
  entry: {
    background: path.join(__dirname, 'index.ts'),
  },
  plugins: [new VitrualWebpackPlugin({ readFromDisk: true }), new CrxLiveReloadWebpackPlugin()],
}

export default CONFIG

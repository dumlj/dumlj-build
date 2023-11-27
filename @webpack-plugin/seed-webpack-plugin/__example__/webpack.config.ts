import type { Configuration } from 'webpack'
import { MemfsWebpackPlugin } from '@dumlj/memfs-webpack-plugin'
import { CustomWebpackPlugin } from './CustomWebpackPlugin'

const CONFIG_A: Configuration = {
  name: 'a',
  mode: 'production',
  plugins: [new MemfsWebpackPlugin(), new CustomWebpackPlugin()],
}

const CONFIG_B: Configuration = {
  name: 'b',
  mode: 'production',
  plugins: [
    new MemfsWebpackPlugin(),
    new CustomWebpackPlugin({
      unnecessary: 'ok',
    }),
  ],
}

export default [CONFIG_A, CONFIG_B]

import type { Configuration } from 'webpack'
import { VitrualWebpackPlugin } from '@dumlj/vitrual-webpack-plugin'
import { CustomWebpackPlugin } from './CustomWebpackPlugin'

const CONFIG_A: Configuration = {
  name: 'a',
  mode: 'production',
  plugins: [new VitrualWebpackPlugin(), new CustomWebpackPlugin()],
}

const CONFIG_B: Configuration = {
  name: 'b',
  mode: 'production',
  plugins: [
    new VitrualWebpackPlugin(),
    new CustomWebpackPlugin({
      unnecessary: 'ok',
    }),
  ],
}

export default [CONFIG_A, CONFIG_B]

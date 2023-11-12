import path from 'path'
import { MemfsWebpackPlugin } from '@dumlj/memfs-webpack-plugin'
import { CompareEnvsWebpackPlugin } from '@dumlj/compare-envs-webpack-plugin'
import { type Configuration } from 'webpack'

const CONFIG: Configuration = {
  mode: process.argv.includes('serve') ? 'development' : 'production',
  entry: {
    main: path.join(__dirname, 'index'),
  },
  plugins: [
    new MemfsWebpackPlugin({
      readFromDisk: true,
    }),
    new CompareEnvsWebpackPlugin({
      compare: ['dotenv/*.env'],
    }),
  ],
}

export default CONFIG

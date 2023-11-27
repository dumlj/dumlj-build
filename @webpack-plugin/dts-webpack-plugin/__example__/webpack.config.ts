import { DtsWebpackPlugin } from '@dumlj/dts-webpack-plugin'
import { PrettyAssetsTreeWebpackPlugin } from '@dumlj/pretty-assets-tree-webpack-plugin'
import path from 'path'
import chalk from 'chalk'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import type { Configuration } from 'webpack'

const CONFIG: Configuration = {
  mode: 'production',
  entry: {
    index: path.join(__dirname, 'resources/index.ts'),
  },
  output: {
    clean: true,
    path: path.join(__dirname, 'build'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.join(__dirname, 'tsconfig.json'),
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new DtsWebpackPlugin({
      rootDir: path.join(__dirname, './resources'),
    }),
    new PrettyAssetsTreeWebpackPlugin({
      banner: chalk.whiteBright.bold('\nThe following files are the DtsWebpackPlugin artifacts.'),
      include: ['**/*.d.ts'],
    }),
  ],
}

export default CONFIG

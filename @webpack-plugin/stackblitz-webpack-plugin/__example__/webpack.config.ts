import path from 'path'
import { type Configuration } from 'webpack'
import { MemfsWebpackPlugin } from '@dumlj/memfs-webpack-plugin'
import { StackblitzWebpackPlugin } from '@dumlj/stackblitz-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import 'webpack-dev-server'

const CONFIG: Configuration = {
  mode: 'development',
  entry: path.join(__dirname, 'resources/index'),
  plugins: [
    new MemfsWebpackPlugin({
      readFromDisk: true,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'resources/index.html'),
    }),
    /**
     * Just import and instantiate the plugin
     * new CrxLiveReloadWebpackPlugin({ host, port })
     */
    new StackblitzWebpackPlugin({
      ignored: [
        '**/__tests__/**',
        '**/__typetests__/**',
        '**/__example__/**',
        '**/__readme__/**',
        '**/build/**',
        '**/dist/**',
        '**/.next/**',
        '**/src/**',
        '**/jest.*',
        '**/tsconfig.build.json',
        '**/tsconfig.build.tsbuildinfo',
        '**/tsconfig.compile.json',
        '**/*.map',
        '**/.gitignore',
        '**/.npmignore',
        '**/.DS_Store',
        '**/LICENSE.md',
        '**/README.md',
      ],
    }),
  ],
}

export default CONFIG

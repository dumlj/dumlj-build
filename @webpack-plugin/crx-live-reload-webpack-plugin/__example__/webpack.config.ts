import path from 'path'
import webpack, { type Configuration } from 'webpack'
import { VitrualWebpackPlugin } from '@dumlj/vitrual-webpack-plugin'
import { CrxLiveReloadWebpackPlugin } from '@dumlj/crx-live-reload-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const CONFIG: Configuration = {
  mode: 'development',
  entry: {
    background: path.join(__dirname, 'background.ts'),
    contentScript: path.join(__dirname, 'contentScript.ts'),
  },
  output: {
    clean: true,
    path: path.join(__dirname, 'build'),
  },
  plugins: [
    /**
     * Just import and instantiate the plugin
     * new CrxLiveReloadWebpackPlugin({ host, port })
     */
    new CrxLiveReloadWebpackPlugin(
      {
        /**
         * **NOTICE**
         * It is point to port of static-server in demo of stackblitz.
         * Because it fails to request different ports from web browser in stackblitz preview.
         * In fact, it must point to the devServer port.
         */
        port: 3000,
        // localhost is set by stackblitz
        host: 'localhost',
      },
      {
        /** MOCK START, PLEASE IGNORE */
        backgroundLiveReloadScript: path.join(__dirname, 'background.livereload.ts'),
        contentScriptReloadScript: path.join(__dirname, 'contentScript.livereload.ts'),
        /** MOCK END, PLEASE IGNORE */
      }
    ),
    new VitrualWebpackPlugin({ readFromDisk: true }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
    }),
    new webpack.DefinePlugin({
      'process.env.STACKBLITZ': JSON.stringify(process.env.STACKBLITZ),
    }),
  ],
  devServer: {
    hot: true,
    port: 8080,
    liveReload: false,
    devMiddleware: {
      writeToDisk: true,
    },
  },
}

export default CONFIG

import fs from 'fs-extra'
import path from 'path'
import { type Configuration, type Compiler } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { ok, warn } from '@dumlj/feature-pretty'
import { MemfsWebpackPlugin } from '@dumlj/memfs-webpack-plugin'
import { CrxManifestWebpackPlugin, type ChromeManifest } from '@dumlj/crx-manifest-webpack-plugin'

const manifestFile = path.join(__dirname, 'manifest.json')
const manifest: ChromeManifest = fs.readJSONSync(manifestFile)

const CONFIG: Configuration = {
  mode: 'production',
  plugins: [
    new MemfsWebpackPlugin({
      readFromDisk: true,
      /**
       * @param boolean
       * You can open it and check the build folder
       * after webpack build.
       */
      // writeToDisk: true
    }),
    new CrxManifestWebpackPlugin({ manifest }),
    {
      apply(compiler: Compiler) {
        compiler.hooks.afterDone.tap('use-for-echo-and-ignore-me', (stats) => {
          if (stats.hasErrors()) {
            return
          }

          const files = MemfsWebpackPlugin.files
          const manifest = Object.keys(files).find((file) => path.relative(__dirname, file) === 'dist/manifest.json')
          ok(`The following is the content of manifest.json.`, { verbose: false })

          // eslint-disable-next-line no-console
          console.dir(JSON.parse(files[manifest].toString()), { depth: null, colors: true })
          warn('Please compare the contents above and ./manifest.json.', { verbose: false })
        })
      },
    },
  ],
  entry: {
    index: './entries/index.ts',
    background: './entries/background.ts',
    contentScript: './entries/contentScript.ts',
    launch: './entries/launch.ts',
    popup: './entries/popup.ts',
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
    },
    usedExports: true,
  },
}

CONFIG.output = {
  ...CONFIG.output,
  filename: '[name].js',
}

CONFIG.plugins.push(new HtmlWebpackPlugin({ filename: 'popup.html' }))

export default CONFIG

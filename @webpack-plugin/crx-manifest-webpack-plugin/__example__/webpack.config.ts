import fs from 'fs-extra'
import path from 'path'
import { type Configuration, type Compiler } from 'webpack'
import { ok } from '@dumlj/feature-pretty'
import { VitrualWebpackPlugin } from '@dumlj/vitrual-webpack-plugin'
import { CrxManifestWebpackPlugin, type ChromeManifest } from '@dumlj/crx-manifest-webpack-plugin'

const manifestFile = path.join(__dirname, 'manifest.json')
const manifest: ChromeManifest = fs.readJSONSync(manifestFile)
const CONFIG: Configuration = {
  mode: 'production',
  plugins: [
    new VitrualWebpackPlugin(),
    new CrxManifestWebpackPlugin({ manifest }),
    {
      apply(compiler: Compiler) {
        compiler.hooks.afterDone.tap('use-for-echo-ignore-me', () => {
          const files = VitrualWebpackPlugin.files
          const manifest = Object.keys(files).find((file) => path.relative(__dirname, file) === 'dist/manifest.json')
          ok(`The following is the content of manifest.json.`, { verbose: false })

          // eslint-disable-next-line no-console
          console.dir(JSON.parse(files[manifest]), { depth: null, colors: true })
        })
      },
    },
  ],
}

export default CONFIG

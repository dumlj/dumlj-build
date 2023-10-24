<!-- This file is dynamically generated. please edit in __readme__ -->

# Crx Manifest Webpack Plugin

generate manifest file for chrome extension

## BACKGROUND

## FEATURE

## INSTALL

```bash
# use npm
$ npm install --dev @dumlj/crx-manifest-webpack-plugin
# use yarn
$ yarn add --dev @dumlj/crx-manifest-webpack-plugin
# use pnpm
$ pnpm add @dumlj/crx-manifest-webpack-plugin -D
```

## USAGE

```ts
import fs from 'fs-extra'
import { CrxManifestWebpackPlugin } from '@dumlj/crx-manifest-webpack-plugin'
import webpack, { type Configuration } from 'webpack'

const manifest: ChromeManifest = fs.readJSONSync(manifestFile)
const config: Configuration = {
  // ...
  plugins: [new CrxManifestWebpackPlugin({ manifest })],
}

export default config
```

## LIVE DEMO

<stackblitz-live-demo height="800px" src="@dumlj-example/crx-manifest-webpack-plugin"></stackblitz-live-demo>

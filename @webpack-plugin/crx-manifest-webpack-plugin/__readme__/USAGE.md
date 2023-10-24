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

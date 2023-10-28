## USAGE

```ts
import { PrettyAssetsTreeWebpackPlugin } from '@dumlj/pretty-assets-tree-webpack-plugin'

export default {
  mode: 'production',
  plugins: [
    new PrettyAssetsTreeWebpackPlugin({
      banner: chalk.whiteBright.bold('The following files are artifacts.'),
      include: ['**/*.d.ts'],
    }),
  ],
}
```

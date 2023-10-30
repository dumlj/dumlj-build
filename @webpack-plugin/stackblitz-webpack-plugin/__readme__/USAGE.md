## USAGE

```ts
import { StackblitzWebpackPlugin } from '@dumlj/stackblitz-webpack-plugin'

export default {
  plugins: [
    new StackblitzWebpackPlugin({
      // something to configure
      ignored: ['**/__tests__/**'],
    }),
  ],
}
```

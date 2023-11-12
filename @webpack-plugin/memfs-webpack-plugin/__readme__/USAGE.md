## USAGE

```ts
import { MemfsWebpackPlugin } from '@dumlj/memfs-webpack-plugin'

export default {
  // ...
  plugins: [
    new MemfsWebpackPlugin({
      readFromDisk: false,
      writeToDisk: false,
      files: {
        './src/index.js': 'console.log("i am virtual module.")',
      },
    }),
  ],
}
```

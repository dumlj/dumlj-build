## 使用

```ts
import { ZipWebpackPlugin } from '@dumlj/zip-webpack-plugin'

export default {
  plugins: [
    new ZipWebpackPlugin({
      // 默认为 false
      lonely: false,
      extras: {
        '/not_import.js': '/do_import.js',
      },
    }),
  ],
}
```

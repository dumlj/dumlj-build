## USAGE

```ts
import { DynamicPublicPathWebpackPlugin } from '@dumlj/dynamic-public-path-webpack-plugin'

export default {
  plugins: [
    new DynamicPublicPathWebpackPlugin({
      s3: {
        publicPath: '/',
        envs: {
          'process.env.WS': 's3',
        },
      },
      oss: {
        publicPath: '/',
        envs: {
          'process.env.WS': 'oss',
        },
      },
    }),
  ],
}
```

## USAGE

```ts
import { DynamicEnvsWebpackPlugin } from '@dumlj/dynamic-envs-webpack-plugin'

export default {
  // ...
  plugins: [
    new DynamicEnvsWebpackPlugin({
      'process.env.APP_ENV': JSON.stringify('development'),
    }),
  ],
}
```

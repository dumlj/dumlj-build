## USAGE

```ts
import { CompareEnvsWebpackPlugin } from '@dumlj/compare-envs-webpack-plugin'

export default {
  // ...
  plugins: [
    new CompareEnvsWebpackPlugin({
      compare: ['dotenv/*.env'],
    }),
  ],
}
```

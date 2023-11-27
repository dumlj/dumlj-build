## USAGE

```ts
import { defineConfig } from 'dumi'
export default defineConfig({
  // ...
  nodeStackblitz: {
    // something to configure
    ignored: ['**/__tests__/**'],
  },
  plugins: [require.resolve('@dumlj/dumi-plugin-node-stackblitz')],
})
```

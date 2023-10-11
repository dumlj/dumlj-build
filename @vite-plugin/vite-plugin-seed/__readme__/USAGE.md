## USAGE

```ts
import { connect, createVitePlugin, vitePlugin } from '@dumlj/vite-plugin-seed'

export const oneVitePluginDemo = connect(
  createVitePlugin('vite-plugin-demo', (custom?: string) => ({ logger, helper }) => {
    const instance = vitePlugin()
    // todo something...

    return {
      ...instance,
    }
  })
)
```

### Expand enhances

```ts
import { enhance, createVitePlugin, vitePlugin } from '@dumlj/vite-plugin-seed'
const { connect } = enhance({
  myEnhance: () => ({ hello: 'world' }),
})

export default connect(
  createVitePlugin('vite-plugin-demo', () => ({ hello }) => {
    const instance = vitePlugin()
    console.log(hello())
    return { ...instance }
  })
)
```

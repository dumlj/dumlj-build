<!-- This file is dynamically generated. please edit in __readme__ -->

# Vite Plugin Seed

Basic vite plugin.

## BACKGROUND

避免基础能力重复编写，特意使用该基础插件进行基础能力建设。

## FEATURE

- 支持 logger 日志服务
- 支持 outdate 更新服务

## INSTALL

```bash
# use npm
$ npm install --dev @dumlj/vite-plugin-seed
# use yarn
$ yarn add --dev @dumlj/vite-plugin-seed
# use pnpm
$ pnpm add @dumlj/vite-plugin-seed -D
```

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

## INTERNAL DEPENDENCIES

<pre>
<b>@dumlj/vite-plugin-seed</b>
└─┬ <a href="https://github.com/dumlj/dumlj-build/tree/main/@vite-plugin/vite-plugin-seed">@dumlj/feature-updater</a>
  ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@vite-plugin/vite-plugin-seed">@dumlj/shell-lib</a>
  ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@vite-plugin/vite-plugin-seed">@dumlj/util-lib</a>
  └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@vite-plugin/vite-plugin-seed">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
</pre>

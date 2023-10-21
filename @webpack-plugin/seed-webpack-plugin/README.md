<!-- This file is dynamically generated. please edit in __readme__ -->

# Seed Webpack Plugin

Basic webpack plugins

## BACKGROUND

Webpack 插件开发存在大量重复流程，因此所有 `@dumlj/*-webpack-plugin` 插件均继承该模块。

## FEATURE

- 统一检查更新，更新提示只会来自一个检测，并只有在 package.json 中声明的依赖才会提示（嵌套插件中，没声明的依赖将会忽略）。
- 提供一些比较通用的方法

## INSTALL

```bash
# use npm
$ npm install --dev @dumlj/seed-webpack-plugin
# use yarn
$ yarn add --dev @dumlj/seed-webpack-plugin
# use pnpm
$ pnpm add @dumlj/seed-webpack-plugin -D
```

## USAGE

```ts
import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import type { Compiler } from 'webpack'

export interface CustomWebpackPluginOptions extends SeedWebpackPluginOptions {
  unnecessary: string
}

export class CustomWebpackPlugin extends SeedWebpackPlugin {
  static PLUGIN_NAME = 'custom-webpack-plugin'
  protected unnecessary: string

  constructor(options?: CustomWebpackPluginOptions) {
    super(options)

    const { unnecessary } = options || {}
    this.unnecessary = unnecessary
  }

  public apply(compiler: Compiler) {
    super.apply(compiler)

    if (this.isSkipIncomplete('skip operation when necessary options are missed.', { unnecessary: this.unnecessary })) {
      return
    }

    compiler.hooks.thisCompilation.tap(this.pluginName, () => {
      this.logger.info('todo something...')
    })
  }
}
```

## DEMO

<stackblitz-live-demo height="800px" src="@dumlj-example/seed-webpack-plugin"></stackblitz-live-demo>

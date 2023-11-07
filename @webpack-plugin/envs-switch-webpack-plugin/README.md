<!-- This file is dynamically generated. please edit in __readme__ -->

# Envs Switch Webpack Plugin

Switch environment variables by generated script.

## BACKGROUND

Because the environment variables in static projects are generally injected into the code through `DefinePlugin`, which can not only change the dynamic switch when the environment is changed, it needs to be recompiled.

The tool is designed to solve this problem by dynamically switching variables before publication to achieve no repeat compilation.

## PRINCIPLE

Replace environment variable codes (e.g. `process.env.name`) with `Object.oFn(name, defaultValue)` via `DefinePlugin`.
The `name` in parameter of `oFn` is a hash value that changes every time when it is compiled.
The `name` refers to the variable name `process.env.{name}`.
The `defaultValue` is the variable in `.env` when it is compiled.
If you don't switch the environment, the function will eventually return to the default value.

## INSTALL

```bash
# use npm
$ npm install --dev @dumlj/envs-switch-webpack-plugin
# use yarn
$ yarn add --dev @dumlj/envs-switch-webpack-plugin
# use pnpm
$ pnpm add @dumlj/envs-switch-webpack-plugin -D
```

## USAGE

```bash
$ echo 'process.env.APP_ENV=production' > dotenv/production.env
$ echo 'process.env.APP_ENV=development' > dotenv/development.env
$ echo 'process.env.APP_ENV=default' > .env
```

```ts
import { DynamicEnvsWebpackPlugin } from '@dumlj/dynamic-envs-webpack-plugin'

export default {
  // ...
  plugins: [new EnvsSwitchWebpackPlugin()],
}
```

## NOTICE

- When `process is not defined` appears, please check whether the variable exists in the `root/path/.env` file.
- If an environment variable does not exist in a specific environment, please check whether the corresponding `dotenv/{env}.env` file exists.
- If the variables are determined only during compilation, you can additionally use `DefinePlugin` for variable substitution, but these variables will not be compiled into dynamic environment variables.
- When compiling, please make sure that the files under `dotenv` have the definitions of all environment variables (subject to `root/path/.env`). Even if the environment does not require the environment variables, you still need to declare the variables.

## LIVE DEMO

<dumlj-stackblitz height="47vw" src="@dumlj-example/envs-switch-webpack-plugin"></dumlj-stackblitz>

## INTERNAL DEPENDENCIES

<pre>
<b>@dumlj/envs-switch-webpack-plugin</b>
├─┬ <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/seed-webpack-plugin">@dumlj/seed-webpack-plugin</a>
│ ├─┬─ <a href="https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-updater">@dumlj/feature-updater</a>
│ │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/shell-lib">@dumlj/shell-lib</a>
│ │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib">@dumlj/util-lib</a>
│ │ └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
│ └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
├─┬ <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/compare-envs-webpack-plugin">@dumlj/compare-envs-webpack-plugin</a><sup><small><i>PRIVATE</i></small></sup>
│ ├─┬─ <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/seed-webpack-plugin">@dumlj/seed-webpack-plugin</a>
│ │ ├─┬─ <a href="https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-updater">@dumlj/feature-updater</a>
│ │ │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/shell-lib">@dumlj/shell-lib</a>
│ │ │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib">@dumlj/util-lib</a>
│ │ │ └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
│ │ └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
│ └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-dotenv">@dumlj/feature-dotenv</a>
└─┬ <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/dynamic-envs-webpack-plugin">@dumlj/dynamic-envs-webpack-plugin</a>
  ├─┬─ <a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/seed-webpack-plugin">@dumlj/seed-webpack-plugin</a>
  │ ├─┬─ <a href="https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-updater">@dumlj/feature-updater</a>
  │ │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/shell-lib">@dumlj/shell-lib</a>
  │ │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib">@dumlj/util-lib</a>
  │ │ └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
  │ └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
  └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib">@dumlj/util-lib</a>
</pre>

<!-- This file is dynamically generated. please edit in __readme__ -->

# Dumi Plugin Mono Readme

Support referencing for readme file of monorepo.

## BACKGROUND

In the monorepo project, the projects have certain standard, and there are a lot of repeated descriptions in the README.md, such as dependency installation, writing project titles and descriptions, etc.
Therefore, we can render the README.md dynamically, thereby reducing document writing and finally pushed to Dumi.

## FEATURE

- dynamic generate docs.
- support tempalte files.
- support dynamic variables.
- support monorepo.

## INSTALL

```bash
# use npm
$ npm install --dev @dumlj/dumi-plugin-mono-readme
# use yarn
$ yarn add --dev @dumlj/dumi-plugin-mono-readme
# use pnpm
$ pnpm add @dumlj/dumi-plugin-mono-readme -D
```

## USAGE

You can create `__readme__` folder and write `*.md` to merge and render docs.
The default file name and file order is `TITLE`, `BACKGROUND`, `FEATURE`, `INSTALL`, `USAGE`, `DEMO`, `CONTRIBUTING`

```ts
import { defineConfig } from 'dumi'
export default defineConfig({
  // ...
  plugins: [require.resolve('@dumlj/dumi-plugin-mono-readme')],
})
```

## LIVE DEMO

See this docs website... 🤠

## INTERNAL DEPENDENCIES

<pre style="font-family:monospace;"><a href="https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/dumi-plugin-mono-readme" target="_blank">@dumlj/dumi-plugin-mono-readme</a>
├─┬ <a href="https://github.com/dumlj/dumlj-build/tree/main/@dumi-plugin/dumi-plugin-seed" target="_blank">@dumlj/dumi-plugin-seed</a>
│ └─┬─ <a href="https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-updater" target="_blank">@dumlj/feature-updater</a>
│ │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/shell-lib" target="_blank">@dumlj/shell-lib</a>
│ │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib" target="_blank">@dumlj/util-lib</a>
│ │ └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib" target="_blank">@dumlj/mock-lib</a>
└─┬ <a href="https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-readme" target="_blank">@dumlj/feature-readme</a>
  ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-prepare" target="_blank">@dumlj/feature-prepare</a>
  └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib" target="_blank">@dumlj/util-lib</a></pre>

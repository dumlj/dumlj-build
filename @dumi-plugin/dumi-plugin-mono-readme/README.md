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

- [@dumlj/dumi-plugin-seed](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/dumi-plugin-mono-readme)<sup><small>PRIVATE</small></sup>
  - [@dumlj/feature-updater](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/dumi-plugin-mono-readme)
    - [@dumlj/shell-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/dumi-plugin-mono-readme)
    - [@dumlj/util-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/dumi-plugin-mono-readme)
    - [@dumlj/mock-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/dumi-plugin-mono-readme)<sup><small>PRIVATE</small></sup>
- [@dumlj/feature-readme](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/dumi-plugin-mono-readme)
  - [@dumlj/feature-prepare](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/dumi-plugin-mono-readme)
  - [@dumlj/util-lib](https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/dumi-plugin-mono-readme)

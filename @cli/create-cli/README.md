<!-- This file is dynamically generated. please edit in __readme__ -->

# Create Cli

Convenient tool for project creation.

## FEATURE

### INSTALL

#### Husky

- Compatible with some GUIs (GitKargen) that will not use `git config core.hooksPath` as a hook, causing hooks to be skipped
- Compatible with some GUIs (SourceTree) and cannot obtain environment paths such as `Node` and `Yarn`
- Compatible with `Windows` platform

## INSTALL

```bash
# use npm
$ npm install --dev @dumlj/create-cli
# use yarn
$ yarn add --dev @dumlj/create-cli
# use pnpm
$ pnpm add @dumlj/create-cli -D
```

## INTERNAL DEPENDENCIES

<pre style="font-family:monospace;"><a href="https://github.com/dumlj/dumlj-build/tree/main/@cli/create-cli" target="_blank">@dumlj/create-cli</a>
└─┬ <a href="https://github.com/dumlj/dumlj-build/tree/main/@cli/seed-cli" target="_blank">@dumlj/seed-cli</a>
  ├─┬─ <a href="https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-updater" target="_blank">@dumlj/feature-updater</a>
  │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/shell-lib" target="_blank">@dumlj/shell-lib</a>
  │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib" target="_blank">@dumlj/util-lib</a>
  │ └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib" target="_blank">@dumlj/mock-lib</a>
  ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-pretty" target="_blank">@dumlj/feature-pretty</a>
  ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/shell-lib" target="_blank">@dumlj/shell-lib</a>
  └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib" target="_blank">@dumlj/util-lib</a></pre>

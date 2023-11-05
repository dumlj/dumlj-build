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

- [@dumlj/seed-cli](https://github.com/dumlj/dumlj-build/tree/main/@cli/create-cli)
  - [@dumlj/feature-updater](https://github.com/dumlj/dumlj-build/tree/main/@cli/create-cli)
    - [@dumlj/shell-lib](https://github.com/dumlj/dumlj-build/tree/main/@cli/create-cli)
    - [@dumlj/util-lib](https://github.com/dumlj/dumlj-build/tree/main/@cli/create-cli)
    - [@dumlj/mock-lib](https://github.com/dumlj/dumlj-build/tree/main/@cli/create-cli)<sup><small>PRIVATE</small></sup>
  - [@dumlj/feature-pretty](https://github.com/dumlj/dumlj-build/tree/main/@cli/create-cli)
  - [@dumlj/shell-lib](https://github.com/dumlj/dumlj-build/tree/main/@cli/create-cli)
  - [@dumlj/util-lib](https://github.com/dumlj/dumlj-build/tree/main/@cli/create-cli)

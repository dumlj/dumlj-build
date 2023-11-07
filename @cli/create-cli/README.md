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

<pre>
<b>@dumlj/create-cli</b>
└─┬ <a href="https://github.com/dumlj/dumlj-build/tree/main/@cli/create-cli">@dumlj/seed-cli</a>
  ├─┬─ <a href="https://github.com/dumlj/dumlj-build/tree/main/@cli/create-cli">@dumlj/feature-updater</a>
  │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@cli/create-cli">@dumlj/shell-lib</a>
  │ ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@cli/create-cli">@dumlj/util-lib</a>
  │ └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@cli/create-cli">@dumlj/mock-lib</a><sup><small><i>PRIVATE</i></small></sup>
  ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@cli/create-cli">@dumlj/feature-pretty</a>
  ├─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@cli/create-cli">@dumlj/shell-lib</a>
  └─── <a href="https://github.com/dumlj/dumlj-build/tree/main/@cli/create-cli">@dumlj/util-lib</a>
</pre>

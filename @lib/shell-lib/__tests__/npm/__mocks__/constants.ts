export const NAME = '@dumlj/shell-lib'

export const PACKAGE = {
  version: '0.0.1',
  name: 'dumlj-build',
  dependencies: {
    '@dumlj/feat-a': {
      version: '0.0.1',
      resolved: 'file:../../@feat/feat-a',
      overridden: false,
      dependencies: {
        '@dumlj/shell-lib': {
          version: '0.0.1',
        },
      },
    },
    [`${NAME}`]: {
      version: '0.0.1',
      resolved: 'file:../../@lib/shell-lib',
      overridden: false,
    },
  },
}

const shellLib = require('@dumlj/shell-lib')
const path = require('path')

const libs = shellLib.yarnWorkspaces.sync()
// 读取所有的工作目录的路径 格式 @webpack-plugin/seed-webpack-plugin
const locations = libs.map(item => item.location)

// 创建所有的包的声明，packageDir 必须是包含包自身和根目录（符合 Node modules solution pattern）
const noExtraneousOverrides = locations
  // map to override rules pointing to local and root package.json for rule
  .map(function (location) {
    return {
      files: [location + '/src/**/*'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: false,
            packageDir: [__dirname, path.resolve(__dirname, location)],
          },
        ],
      },
    }
  })

module.exports = {
  /**
   * 设置为根目录
   * @see https://eslint.org/docs/latest/user-guide/configuring/configuration-files#cascading-and-hierarchy
   */
  root: true,
  extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    /** 项目 ts 配置文件 */
    project: './tsconfig.json',
  },
  env: {
    node: true,
  },
  plugins: ['@typescript-eslint', 'eslint-plugin-import', 'prettier', 'react-hooks'],
  rules: {
    /** 请与 `.prettierrc.js` 保持一致 */
    'max-len': [
      'error',
      {
        /** 一行的字符数, 如果超过会进行换行 */
        code: 180,
        tabWidth: 2,
        ignoreTemplateLiterals: true,
        ignoreUrls: true,
        ignoreStrings: true,
      },
    ],
    semi: ['error', 'never'],
    'no-console': 'warn',
    /** 不能重复引入 */
    'import/no-duplicates': 'warn',
    /** 类型导出必须使用 type */
    '@typescript-eslint/consistent-type-exports': 'warn',
    /** 类型导入必须使用 type */
    '@typescript-eslint/consistent-type-imports': 'warn',
    /** 不能使用 any */
    '@typescript-eslint/no-explicit-any': 'off',
    /** 必须声明返回类型 */
    '@typescript-eslint/explicit-function-return-type': 'off',
    /** 必须声明入参类型 */
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    /**
     * 基础类型复制无需声明类型
     * @see https://typescript-eslint.io/rules/no-inferrable-types
     */
    '@typescript-eslint/no-inferrable-types': 'warn',
    /** interface 名字前缀 */
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none',
          requireLast: false,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    /** 引用必须在依赖中有声明 */
    'import/no-extraneous-dependencies': [
      'warn',
      {
        /**
         * SRC 下不能有只声明在 devDependencies 的依赖
         * 特定情况可以通过 `// eslint-disable-next-line import/no-extraneous-dependencies` 忽略
         */
        devDependencies: ['**/*.spec.ts'],
      },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  overrides: noExtraneousOverrides,
}

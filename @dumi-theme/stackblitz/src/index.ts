import type { IApi } from 'dumi'
import path from 'path'

export default (api: IApi) => {
  const cwd = process.cwd()
  path.join(cwd, '.dumi/theme/builtins')

  api.chainWebpack((memo) => {
    memo.plugin('stackblitz-plugin').use({
      apply() {
        console.log('--------')
      },
    })

    memo.module.rule('dumi-md').type('javascript/auto').test(/\.md$/).oneOf('md').pre().use('stackblitz-loader').loader(require.resolve('./loaders/markdown'))

    return memo
  })
}

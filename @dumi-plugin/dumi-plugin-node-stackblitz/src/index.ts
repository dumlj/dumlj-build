import type { IApi } from 'dumi'
import { StackblitzWebpackPlugin, type StackblitzWebpackPluginOptions } from '@dumlj/stackblitz-webpack-plugin'
import { stackblitzRemark } from './stackblitz-remark'

export interface UserConfig {
  nodeStackblitz: StackblitzWebpackPluginOptions
}

export default (api: IApi & { useConfig: UserConfig }) => {
  const { nodeStackblitz = {} } = api.useConfig || {}

  api.describe({
    key: 'nodeStackblitz',
    config: {
      schema(joi) {
        return joi
          .object({
            manifest: joi.string().optional(),
            ignored: joi.array().items(joi.string()).optional(),
            files: joi.array().items(joi.string()).optional(),
          })
          .optional()
      },
    },
  })

  api.chainWebpack((config) => {
    config.plugins.set(StackblitzWebpackPlugin.PLUGIN_NAME, config.plugin(StackblitzWebpackPlugin.PLUGIN_NAME).use(new StackblitzWebpackPlugin(nodeStackblitz)))
  })

  api.register({
    key: 'modifyConfig',
    stage: Infinity,
    fn: (memo: IApi['config']) => {
      memo.extraRemarkPlugins = [stackblitzRemark, ...(memo?.extraRemarkPlugins || [])]
      return memo
    },
  })
}

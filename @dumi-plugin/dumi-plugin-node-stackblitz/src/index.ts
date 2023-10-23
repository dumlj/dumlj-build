import { createDumiPlugin } from '@dumlj/dumi-plugin-seed'
import { StackblitzWebpackPlugin, type StackblitzWebpackPluginOptions } from '@dumlj/stackblitz-webpack-plugin'

export interface NodeStackblitzOptions {
  nodeStackblitz: StackblitzWebpackPluginOptions
}

export default createDumiPlugin<NodeStackblitzOptions>('nodeStackblitz', async (api, { pushWebpackPlugin }) => {
  const { publicPath, nodeStackblitz = {} } = api.userConfig || {}

  api.describe({
    key: 'nodeStackblitz',
    config: {
      schema(joi) {
        return joi
          .object<StackblitzWebpackPluginOptions>({
            manifest: joi.string().optional(),
            ignored: joi.array().items(joi.string()).optional(),
            files: joi.array().items(joi.string()).optional(),
          })
          .optional()
      },
    },
  })

  pushWebpackPlugin(StackblitzWebpackPlugin.PLUGIN_NAME, new StackblitzWebpackPlugin({ ...nodeStackblitz, publicPath }))
})

import { createDumiPlugin } from '@dumlj/dumi-plugin-seed'
import { StackblitzWebpackPlugin, type StackblitzWebpackPluginOptions } from '@dumlj/stackblitz-webpack-plugin'

export interface UserConfig {
  nodeStackblitz: StackblitzWebpackPluginOptions
}

export default createDumiPlugin<UserConfig>('nodeStackblitz', async (api, { registerSyntax, pushWebpackPlugin }) => {
  const { nodeStackblitz = {} } = api.useConfig || {}

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

  /**
   * because web component has been registered,
   * we only need to register the custom syntax
   * block without specifying a file.
   */
  registerSyntax({ syntax: 'stackblitz-live-demo' })
  pushWebpackPlugin(StackblitzWebpackPlugin.PLUGIN_NAME, new StackblitzWebpackPlugin(nodeStackblitz))
})

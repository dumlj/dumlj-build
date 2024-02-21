import type { NextConfig } from 'next'
import { NextDynamicClientWebpackPlugin, type NextDynamicClientWebpackPluginOptions } from './NextDynamicClientWebpackPlugin'

export function nextDynamicClient(options?: NextDynamicClientWebpackPluginOptions) {
  return function withDynamicClient(nextConfig: NextConfig) {
    const noConflit = nextConfig.webpack
    nextConfig.webpack = (config, context) => {
      config.plugins.push(new NextDynamicClientWebpackPlugin(options))
      if (typeof noConflit === 'function') {
        return noConflit(config, context)
      }

      return config
    }

    return nextConfig
  }
}

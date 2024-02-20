import type { NextConfig } from 'next'
import { NextDynamicClientWebpackPlugin, type NextDynamicClientWebpackPluginOptions } from './NextDynamicClientWebpackPlugin'

export function nextDynamicClient(options?: NextDynamicClientWebpackPluginOptions) {
  return function withDynamicClient(nextConfig: NextConfig) {
    const noConflit = nextConfig.webpack
    nextConfig.webpack = (config, nextOptions) => {
      config.plugins.push(new NextDynamicClientWebpackPlugin(options))
      if (typeof noConflit === 'function') {
        return noConflit(config, nextOptions)
      }

      return config
    }

    return nextConfig
  }
}

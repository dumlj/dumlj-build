import type { NextConfig } from 'next'
// export * from './NextDynamicClientWebpackPlugin'

export default function dynamicClient(nextConfig: NextConfig) {
  const noConflit = nextConfig.webpack
  nextConfig.webpack = (config, options) => {
    const { isServer } = options
    if (!isServer) {
      config.plugins.push()
    }

    if (typeof noConflit === 'function') {
      return noConflit(config, options)
    }

    return config
  }

  return nextConfig
}

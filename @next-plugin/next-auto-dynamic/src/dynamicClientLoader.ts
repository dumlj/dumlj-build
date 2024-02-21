import type { LoaderContext } from 'webpack'

export interface DynamicClientLoaderOptions {
  getVirtualModules(): Map<string, string>
}

export default function dynamicClientLoader(this: LoaderContext<DynamicClientLoaderOptions>, source: string) {
  const { getVirtualModules } = this.getOptions()
  const virtualModules = getVirtualModules()
  if (virtualModules.has(this.resourcePath)) {
    return virtualModules.get(this.resourcePath)
  }

  return source
}

import path from 'path'
import { prepare } from '@dumlj/feature-prepare'
import { DEFAULT_CONFIG_FILE_NAME, DEFAULT_TEMPLATE_FILE_NAME, DEFAULT_OUTPUT, DEFAULT_SNIPPETS } from '../constants'
import type { ReadmeConfiguration, ReadmeConfig } from '../types'

/** global cache */
const ConfigCache = new Map<string, ReadmeConfig>()

export interface ResolveConfigOptions {
  /** 配置文件路径 */
  configFile?: string
  /** 默认值 */
  defaults?: ReadmeConfig
  /** 项目路径/上下文路径 */
  cwd?: string
}

/** 解析配置文件 */
export const resolveConfig = async <O extends Record<string, any>>(options?: ResolveConfigOptions) => {
  const { configFile = DEFAULT_CONFIG_FILE_NAME, defaults = {}, cwd = process.cwd() } = options
  const rcFile = path.join(cwd, configFile)
  if (ConfigCache.has(rcFile)) {
    return ConfigCache.get(rcFile)
  }

  const { configure } = await prepare<{ configure: ReadmeConfiguration<O> }>(rcFile)
  const {
    snippets = DEFAULT_SNIPPETS,
    template = DEFAULT_TEMPLATE_FILE_NAME,
    output = DEFAULT_OUTPUT,
    helpers,
    metadatas: metadatasResolvers,
    ...restProps
  } = (await configure()) || {}

  /** 额外数据 */
  const metadatas: Record<string, any> = {}
  if (typeof metadatasResolvers === 'object' && metadatasResolvers !== null) {
    for (const [name, fn] of Object.entries(metadatasResolvers)) {
      if (typeof fn === 'function') {
        metadatas[name] = await fn()
        continue
      }

      metadatas[name] = fn
    }
  }

  const config = { ...defaults, snippets, template, output, helpers, metadatas, ...restProps }
  ConfigCache.set(rcFile, config)
  return config
}

import path from 'path'
import fs from 'fs'
import { prepare } from '@dumlj/feature-prepare'
import { DUMLJ_CONFIG_FILE_NAME } from './constants/definition'

const CACHE = new Map<string, any>()

export async function resolveOptions<P = any>(ns: string, folder: string): Promise<P | null> {
  const conf = path.join(folder, DUMLJ_CONFIG_FILE_NAME)
  if (CACHE.has(conf)) {
    const config = CACHE.get(conf)
    return config[ns] || null
  }

  if (!fs.existsSync(conf)) {
    return null
  }

  const { default: configure } = await prepare(conf)
  const config = configure()
  CACHE.set(conf, config)
  return config[ns]
}

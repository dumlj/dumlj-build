import path from 'path'
import fs from 'fs-extra'

export interface RegisterCacheOptions {
  /** 过期时间 */
  expire?: number
}

/** 注册缓存 */
export const registerCache = <T>(scope: string = (Date.now() + Math.random() * 1e13).toString(32), options?: RegisterCacheOptions) => {
  const { expire } = options || {}
  const folder = path.join(process.cwd(), 'node_modules/.dumlj-cache', scope)

  /** 写缓存 */
  const write = async (name: string, data: T) => {
    const file = path.join(folder, name)
    await fs.ensureFile(file)
    await fs.writeJSON(file, { _update: Date.now(), data })
  }

  /** 读缓存 */
  const read = async (name: string): Promise<T> => {
    const file = path.join(folder, name)
    if (await fs.pathExists(file)) {
      const { _update: updateTime, data } = await fs.readJson(file)
      if (!expire) {
        return data
      }

      if (Date.now() > parseInt(updateTime) + expire) {
        return data
      }
    }
  }

  return { write, read }
}

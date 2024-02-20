import path from 'path'
import fs from 'fs-extra'

export interface RegisterCacheOptions {
  /** 过期时间 */
  expire?: number
}

export interface ReadOptions {
  /** 获取后删除 */
  remove?: boolean
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
  const read = async (name: string, options?: ReadOptions): Promise<T | undefined> => {
    const { remove: removeAfterRead = false } = options || {}
    const file = path.join(folder, name)
    if (await fs.pathExists(file)) {
      const { _update: updateTime, data } = await fs.readJson(file)
      removeAfterRead && remove(name)

      if (!expire) {
        return data
      }

      if (Date.now() > parseInt(updateTime) + expire) {
        return data
      }
    }
  }

  /** 删除缓存 */
  const remove = async (name: string) => {
    const file = path.join(folder, name)
    await fs.remove(file)
  }

  return { write, read, remove }
}

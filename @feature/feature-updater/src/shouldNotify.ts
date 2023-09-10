import fs from 'fs-extra'
import path from 'path'

export interface ShouldNotifyOptions {
  /**
   * 过期时间(单位毫秒)
   * @description
   * 默认为 1 天
   * 当前时间减去上一次告警时间必须大于该时间
   * 才能再告警
   */
  expire?: number
}

export const shouldNotify = async (token: string, options?: ShouldNotifyOptions) => {
  const { expire = 1e3 * 60 * 60 * 1 } = options || {}
  const file = path.join(process.cwd(), 'node_modules', '.updator', token)
  await fs.ensureFile(file)

  const lastDateTime = Number((await fs.readFile(file)).toString())
  if (Date.now() - lastDateTime < expire) {
    return false
  }

  await fs.writeFile(file, Date.now().toString())
  return true
}

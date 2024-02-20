import fs from 'fs'
import path from 'path'

/** 向上查找文件 */
export const lookupFile = async (name: string, paths: string[]) => {
  const current = [...paths]
  while (current.length > 0) {
    const folder = current.shift()
    const file = path.join(folder, name)

    if (fs.existsSync(file)) {
      return file
    }
  }
}

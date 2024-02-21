import fs from 'fs'
import path from 'path'

/** 向上查找文件 */
export async function lookupFile(name: string, paths: string[]) {
  const current = [...paths]
  while (current.length > 0) {
    const folder = current.shift()
    if (!folder) {
      return
    }

    const file = path.join(folder, name)
    if (fs.existsSync(file)) {
      return file
    }
  }
}

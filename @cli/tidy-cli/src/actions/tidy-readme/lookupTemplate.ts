import fs from 'fs-extra'
import path from 'path'

/** 向上查找文件 */
export const lookupTemplate = async (name: string, paths: string[]) => {
  const current = [...paths]
  while (current.length > 0) {
    const template = current.shift()
    const file = path.join(template, `${name}.md`)
    if (await fs.pathExists(file)) {
      return file
    }
  }
}

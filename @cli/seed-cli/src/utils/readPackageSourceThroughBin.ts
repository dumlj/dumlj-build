import fs from 'fs-extra'
import path from 'path'

/**
 * 读取 bin 所在模块的 package.json 内容
 * @param binPath bin 文件的绝对路径
 * @description
 * 类似 node_modules 方式，逐层往上寻找
 */
export const readPackageSourceThroughBin = async (binPath: string): Promise<PackageSource> => {
  const readPackageJson = async (folder: string) => {
    const file = path.join(folder, 'package.json')
    if (await fs.pathExists(file)) {
      return fs.readJSON(file, { encoding: 'utf-8' })
    }

    return null
  }

  let current: string = path.dirname(binPath)
  while (true) {
    if (['.', '/'].includes(current)) {
      return readPackageJson('/')
    }

    const content = await readPackageJson(current)
    if (content) {
      return content
    }

    current = path.dirname(current)
  }
}

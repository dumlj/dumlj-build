import fs from 'fs'
import { readRootPathThroughBin } from './readRootPathThroughBin'
import path from 'path'

/**
 * 读取 bin 所在模块的 package.json 内容
 * @param binPath bin 文件的绝对路径
 * @description
 * 类似 node_modules 方式，逐层往上寻找
 */
export async function readPackageSourceThroughBin(binPath: string): Promise<PackageSource | null> {
  const folder = await readRootPathThroughBin(binPath)
  if (!folder) {
    return null
  }

  try {
    const file = path.join(folder, 'package.json')
    const content = await fs.promises.readFile(file, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    return null
  }
}

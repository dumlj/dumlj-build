import fs from 'fs-extra'
import path from 'path'
import { DEFAULT_TEMPLATE_FILE_NAME } from '../constants'

export interface FindSnippetsOptions {
  /**
   * 模板文件（文件夹）
   * @description
   * folder of template which store snippets of README.md
   */
  template?: string
  /** 项目绝对路径 */
  cwd?: string
}

/**
 * 获取 readme 文件夹
 * @description
 * 类似 node_modules 的查找模式，
 * 将所有 "template" 的路径记录并返回
 */
export const findSnippets = async (location: string, options?: FindSnippetsOptions) => {
  const { template = DEFAULT_TEMPLATE_FILE_NAME, cwd = process.cwd() } = options || {}
  location = path.isAbsolute(location) ? location : path.join(cwd, location)

  const paths = []

  /** 需要阻塞遍历 */
  /** 文件夹 */
  let current = location
  while (true) {
    const target = path.join(current, template)
    if (await fs.pathExists(target)) {
      paths.push(target)
    }

    if (current === cwd || ['.', '/'].includes(current)) {
      break
    }

    current = path.dirname(current)
  }

  if (!(paths.length > 0)) {
    return
  }

  return { location, paths }
}

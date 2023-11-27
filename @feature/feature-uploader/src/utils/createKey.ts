import path from 'path'

/** 生成文件 KEY 配置 */
export interface CreateKeyOptions {
  /**
   * 跟路径
   * @description
   * 默认为空字符串
   */
  rootPath?: string
  /**
   * 目录路径
   * @description
   * 默认为空字符串
   */
  directory?: string
  /**
   * 上传后前缀路径
   * @description
   * 默认为空字符串
   */
  prefix?: string
}

/** 生成文件 KEY */
export const createKey = (file: string, options?: CreateKeyOptions) => {
  const { rootPath = '/', directory = rootPath, prefix = '' } = options || {}
  const absPath = path.isAbsolute(file) ? file : path.join(directory, file)
  const relativePath = path.isAbsolute(absPath) ? path.relative(rootPath, absPath) : absPath
  return path.join(prefix, relativePath).replace(/\\/g, '/')
}

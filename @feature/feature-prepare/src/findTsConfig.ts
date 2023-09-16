import fs from 'fs-extra'
import path from 'path'

export interface FindTsConfigOptions {
  /** 执行路径 */
  cwd?: string
}

/**
 * 查找 TS 配置文件
 * @description
 * The search method is similar to node search for dependencies.
 * Return false when tsconfig not found.
 * @example
 * tsconfig paths
 * /packages/a/src/tsconfig.json
 * /packages/a/tsconfig.json
 * /packages/tsconfig.json
 * /tsconfig.json
 */
export const findTsConfig = async (file: string, options?: FindTsConfigOptions): Promise<boolean | string> => {
  const { cwd = path.sep } = options || {}
  if (!(await fs.pathExists(file))) {
    throw new Error(`File ${file} is not exists`)
  }

  const folder = path.dirname(file)
  const tsConfig = path.join(folder, 'tsconfig.json')
  if (await fs.pathExists(tsConfig)) {
    return tsConfig
  }

  if (!path.relative(folder, cwd)) {
    return false
  }

  return findTsConfig(folder, options)
}

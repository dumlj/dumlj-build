import fs from 'fs-extra'
import path from 'path'

export interface FindTsConfigOptions {
  cwd?: string
}

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

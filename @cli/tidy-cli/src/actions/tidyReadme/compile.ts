import fs from 'fs-extra'
import handlebars from 'handlebars'
import { lookupFile } from './lookupFile'

export interface CompileParams {
  /**
   * 文件集合
   * @example
   * [
   *  'TITLE.md',
   *  'FEATURE.md'
   * ]
   */
  files: string[]
  /**
   * 需要查找文件路径的集合
   * @example
   * [
   *  '/a/b/__readme__',
   *  '/a/__readme__',
   *  '/__readme__',
   * ]
   */
  lookupPaths: string[]
}

/** 编译文件 */
export const compile = async (params: CompileParams) => {
  const { files, lookupPaths } = params
  const renders = await Promise.all(
    files.map(async (file) => {
      const template = await lookupFile(file, lookupPaths)
      if (!template) {
        return
      }

      const source = (await fs.readFile(template)).toString()
      const render = handlebars.compile(source)
      return render
    })
  )

  return renders.filter(Boolean)
}

import fs from 'fs-extra'
import handlebars from 'handlebars'
import { lookupFile } from './lookupFile'

export interface CompileSnippetsParams {
  /**
   * 代码片段
   * @example
   * [
   *  'TITLE.md',
   *  'FEATURE.md'
   * ]
   */
  snippets: string[]
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

/** 编译代码片段 */
export const compileSnippets = async (params: CompileSnippetsParams) => {
  const { snippets, lookupPaths } = params
  const renders = await Promise.all(
    snippets.map(async (snippet) => {
      const template = await lookupFile(snippet, lookupPaths)
      if (!template) {
        return
      }

      const source = (await fs.readFile(template)).toString()
      return handlebars.compile(source)
    })
  )

  if (renders.length === 0) {
    return
  }

  return (context?: Record<string, any>) => {
    return renders
      .filter(Boolean)
      .map((fn) => fn(context))
      .join('\n')
  }
}

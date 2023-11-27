import { lookupFile } from '../utils/lookupFile'
import { existsRender, getRender, updateRender } from './renderStore'

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
  const snippetRenders = await Promise.all(
    snippets.map(async (snippet) => {
      const markdown = await lookupFile(snippet, lookupPaths)
      if (!markdown) {
        return
      }

      if (!existsRender(markdown)) {
        await updateRender(markdown)
      }

      // 返回必须不能为异步
      return (context: Record<string, any>) => {
        const render = getRender(markdown)
        return render(context)
      }
    })
  )

  const renders = snippetRenders.filter(Boolean)
  if (renders.length === 0) {
    return
  }

  return (context?: Record<string, any>) => {
    const section = renders.map((render) => render(context))
    return section.join('\n')
  }
}

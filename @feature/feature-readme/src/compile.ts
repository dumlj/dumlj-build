import { resolveConfig } from './resolveConfig'
import { resolveProject } from './resolveProject'
import { findSnippets } from './findSnippets'
import { compileSnippets } from './compileSnippets'
import { README_BANNER } from './constants'

/** trim promise wrapper */
export type TrimPromise<P> = P extends Promise<infer R> ? R : P

export interface Metadata extends TrimPromise<ReturnType<typeof resolveProject>> {
  [K: string]: any
}

export interface CompileOptions {
  /** 配置文件 */
  configFile?: string
  /** 执行路径/项目绝对路径 */
  cwd?: string
  /** head of README.md */
  banner?: string | ((data: Metadata) => string)
  /**
   * 模板文件（文件夹）
   * @description
   * folder of template which store snippets of README.md
   */
  template?: string
}

/** 编译文档 */
export const compile = async (location: string, options?: CompileOptions) => {
  const { configFile, cwd, banner = README_BANNER } = options || {}
  const { template, snippets, helpers, metadatas } = await resolveConfig({ configFile, cwd })

  // 优先使用传入的 template
  // template of options first
  const { paths: lookupPaths } = await findSnippets(location, { template: options?.template || template, cwd })
  const renderSnippets = await compileSnippets({ snippets: snippets.map((snippet) => `${snippet}.md`), lookupPaths })
  if (typeof renderSnippets !== 'function') {
    return
  }

  const info = await resolveProject(location, { cwd })
  return (data?: Partial<Metadata>) => {
    const context = { location, ...info, ...helpers, ...metadatas, ...data }
    const codes = renderSnippets(context)
    const head = typeof banner === 'function' ? banner(context) : banner
    const content = [head].concat(codes)
    return content.join('\n\n')
  }
}

import handlebars from 'handlebars'
import { resolveConfig } from '../utils/resolveConfig'
import { resolveProject } from '../utils/resolveProject'
import { findSnippets } from '../utils/findSnippets'
import { compileSnippets } from './compileSnippets'
import { README_BANNER } from '../constants'
import * as DEFAULT_HELPERS from '../helper'

/** trim promise wrapper */
export type TrimPromise<P> = P extends Promise<infer R> ? R : P

export interface Metadata extends TrimPromise<ReturnType<typeof resolveProject>> {
  [K: string]: any
}

export interface CompileProjectOptions {
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
  /** 多语言 */
  local?: string
}

/** 编译文档 */
export async function compileProject(location: string, options?: CompileProjectOptions) {
  const { configFile, cwd, banner = README_BANNER, local } = options || {}
  const { template, helpers, snippets: inSnippets, metadatas } = await resolveConfig({ configFile, cwd })
  if (!(Array.isArray(inSnippets) && inSnippets.length)) {
    return
  }

  const snippets = inSnippets.map((snippet) => `${snippet}${local ? `.${local}` : ''}.md`)

  // 优先使用传入的 template
  // template of options first
  const result = await findSnippets(location, { template: options?.template || template, cwd })
  if (!result) {
    return
  }

  const { paths: lookupPaths } = result
  const renderSnippets = await compileSnippets({ snippets, lookupPaths })
  if (typeof renderSnippets !== 'function') {
    return
  }

  const info = await resolveProject(location, { cwd })
  return (data?: Partial<Metadata>) => {
    const context = { location, ...info, ...metadatas, ...data }
    for (const [name, fn] of Object.entries({ ...DEFAULT_HELPERS, ...helpers })) {
      handlebars.registerHelper(name, fn.bind(null, context))
    }

    const codes = renderSnippets(context)
    const head = typeof banner === 'function' ? banner(context) : banner
    const content = [head].concat(codes)
    return content.join('\n\n')
  }
}

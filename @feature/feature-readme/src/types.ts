import type { Project } from '@dumlj/util-lib'

export type TreeProject = Project & { internalDependencies: TreeProject[] }

export interface Context {
  alias: string
  name: string
  description: string
  location: string
  repository: {
    type: string
    url: string
    directory: string
  }
  projects: Project[]
  dependencies?: TreeProject[]
}

/** 文档配置项 */
export interface ReadmeConfig {
  output?: string
  /** 文档片段 */
  snippets?: string[]
  /**
   * 文档模板文件名称
   * @description
   * name of docs template file
   */
  template?: string
  /**
   * 元数据
   * @description
   * 渲染引擎传入的数据
   */
  metadatas?: Record<string, any | (() => Promise<any>)>
  /**
   * 辅助函数
   * @description
   * handlebars 的辅助函数
   */
  helpers?: Record<string, (context: Context) => string>
}

/** 配置函数 */
export type ReadmeConfiguration<T extends Record<string, any> = Record<string, unknown>> = () => Promise<ReadmeConfig & T>

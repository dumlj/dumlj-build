import { type HelperDelegate } from 'handlebars'

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
  helpers?: Record<string, (name: string, fn: HelperDelegate) => string>
}

/** 配置函数 */
export type ReadmeConfiguration<T extends Record<string, any>> = () => Promise<ReadmeConfig & T>

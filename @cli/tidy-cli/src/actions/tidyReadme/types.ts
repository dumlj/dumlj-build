import { type HelperDelegate } from 'handlebars'

export interface ReadmeConfig {
  output?: string
  parts?: string[]
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

export type ReadmeConfiguration = () => Promise<ReadmeConfig>

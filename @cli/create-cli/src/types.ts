import type { SourceFile } from 'ts-morph'

export interface PkgTranformParams {
  /** 名称 */
  name: string
  /** 描述 */
  description: string
  /** 文件名 */
  file: string
  /** 内容 */
  source: PackageSource
}

export interface TsTranformParams {
  /** 名称 */
  name: string
  /** 描述 */
  description: string
  /** 文件名 */
  file: string
  /** 语法树，使用 ts-morph */
  ast: SourceFile
}

export interface UpdateConfig {
  output?: string
}

export interface TemplateSchema {
  /** 名称 */
  name: string
  /** 描述 */
  description: string
  /** 输出文件 */
  outputPathResolver(kebabCaseName: string): string
  /** json 内容转换器 */
  pkgTranform(params: PkgTranformParams): Promise<UpdateConfig | void>
  /** ts 内容 转换器 */
  tsTranform(params: TsTranformParams): Promise<UpdateConfig | void>
}

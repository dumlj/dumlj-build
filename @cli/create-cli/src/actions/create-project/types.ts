import type { SourceFile } from 'ts-morph'

export interface PkgTransformParams {
  /** 名称 */
  name: string
  /** 描述 */
  description: string
  /** 文件名 */
  file: string
  /** 内容 */
  source: PackageSource
}

export interface TsTransformParams {
  /** 名称 */
  name: string
  /** 描述 */
  description: string
  /** 文件名 */
  file: string
  /** 语法树，使用 ts-morph */
  ast: SourceFile
}

export interface TransformReuslt {
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
  pkgTransform(params: PkgTransformParams): Promise<TransformReuslt | void>
  /** ts 内容 转换器 */
  tsTransform(params: TsTransformParams): Promise<TransformReuslt | void>
}

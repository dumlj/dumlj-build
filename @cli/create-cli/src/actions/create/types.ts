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
  /** 名称例子 */
  egName?: string
  /** 重命名 */
  nameTransform?(name: string): {
    shortName: string
    name: string
    same: string
    suffix: string
  }
  /** 输出文件 */
  outputPathResolver(kebabCaseName: string): string
  /** json 内容转换器 */
  pkgTransform(file: string): ((params: PkgTransformParams) => Promise<TransformReuslt | void>) | void
  /** ts 内容 转换器 */
  tsTransform?(file: string): ((params: TsTransformParams) => Promise<TransformReuslt | void>) | void
}

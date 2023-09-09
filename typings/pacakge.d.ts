declare interface PackageSource {
  /** 名称 */
  name: string
  /** 版本 */
  version: string
  /** 描述 */
  description?: string
  /** 是否为私有 */
  private?: boolean
  /** 工作区 */
  workspaces:
    | string[]
    | {
        packages?: string[]
        nohoist?: string[]
      }
  /** 脚本 */
  scripts?: Record<string, string>
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies: Record<string, string>
  optionalDependencies?: Record<string, string>
  bundleDependencies?: Record<string, string>
  bundledDependencies?: Record<string, string>
  [name: string]: any
}

declare module '*/package.json' {
  const source: PackageSource
  export default source
}

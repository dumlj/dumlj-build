export interface NpmLsDependency {
  version: string
  resolved: string
  overridden: boolean
}

export interface NpmLsInfo {
  name: string
  version: string
  dependencies: Record<string, NpmLsDependency>
}

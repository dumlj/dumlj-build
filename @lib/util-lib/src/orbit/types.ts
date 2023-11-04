export interface OrbitNode {
  path: string[]
  value: string
  isLatest: boolean
  children?: Set<OrbitNode>
}

export interface ExtraOrbitNode extends OrbitNode {
  siblings: OrbitNode[]
}

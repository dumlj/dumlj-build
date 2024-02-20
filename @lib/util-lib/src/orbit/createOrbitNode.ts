import type { OrbitNode } from './types'

export function createOrbitNode(nodes: string[], isLatest: boolean, childs: OrbitNode[] = []) {
  if (nodes.length === 0) {
    return
  }

  const path = [...nodes]
  const value = path.pop()!
  const children = new Set([...childs])
  return { path, value, isLatest, children }
}

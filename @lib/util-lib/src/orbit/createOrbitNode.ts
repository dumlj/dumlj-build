import type { OrbitNode } from './types'

export const createOrbitNode = (nodes: string[], isLatest: boolean, childs: OrbitNode[] = []) => {
  const path = [...nodes]
  const value = path.pop()
  const children = new Set([...childs])
  return { path, value, isLatest, children }
}

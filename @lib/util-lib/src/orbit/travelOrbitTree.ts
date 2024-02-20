import type { OrbitNode, ExtraOrbitNode } from './types'

export interface TravelOptions {
  ignoreRoot?: boolean
}

export function travelOrbitTree(tree: OrbitNode, options?: TravelOptions) {
  return (handle: (node: ExtraOrbitNode, chain: ExtraOrbitNode[]) => void) => {
    const { ignoreRoot = true } = options || {}
    const walk = (node: ExtraOrbitNode, chain: ExtraOrbitNode[]) => {
      if (!(ignoreRoot && chain.length === 0)) {
        handle(node, chain)
      }

      const { isLatest, children } = node
      if (isLatest || !(children && children?.size > 0)) {
        return
      }

      const previous: OrbitNode[] = []
      const paths: OrbitNode[] = []

      for (const node of Array.from(children.values())) {
        node.isLatest ? paths.push(node) : previous.push(node)
      }

      const nodes = [...previous, ...paths]
      for (const node of [...previous, ...paths]) {
        const extra = { ...node, siblings: nodes }
        walk(extra, chain.concat(extra))
      }
    }

    walk({ ...tree, siblings: [] }, [])
  }
}

import { DIVIDER_CHAR } from './constants'
import { createOrbitNode } from './createOrbitNode'
import type { OrbitNode } from './types'

export function mapPathsToOrbitTree(paths: string[][]) {
  const collection = new Map<string, OrbitNode>()
  const roots: string[] = []

  const tokens = new Set<string>()
  const filteredPaths: string[][] = []
  paths.forEach((parts) => {
    const token = parts.join(DIVIDER_CHAR)
    if (tokens.has(token)) {
      return
    }

    filteredPaths.push(parts)
    tokens.add(token)
  })

  for (const parts of filteredPaths) {
    let current = [...parts]
    let isLatest = true

    if (current.length === 1) {
      const node = createOrbitNode(current, isLatest)!
      const token = current.join(DIVIDER_CHAR)
      collection.set(token, node)
      roots.push(token)
      continue
    }

    while (true) {
      const previous = current.slice(0, -1)
      const curToken = current.join(DIVIDER_CHAR)
      const preToken = previous.join(DIVIDER_CHAR)

      if (previous.length === 0) {
        // top element
        if (current.join(DIVIDER_CHAR) === preToken) {
          const node = createOrbitNode(current, isLatest)!
          collection.set(curToken, node)
          roots.push(curToken)
        }

        break
      }

      // create previous
      if (!collection.has(preToken)) {
        const node = createOrbitNode(previous, false)!
        collection.set(preToken, node)

        const isRoot = preToken.indexOf(DIVIDER_CHAR) === -1
        isRoot && roots.push(preToken)
      }

      // create current
      let node = collection.get(curToken)
      if (!node) {
        node = createOrbitNode(current, isLatest)!
        collection.set(curToken, node)
      }

      // add children
      const parent = collection.get(preToken)
      if (parent) {
        /**
         * change parent to path not node,
         * the logic affects travelOrbitTree
         */
        parent.isLatest = false
        parent.children && parent.children.add(node)
      }

      current = previous
      isLatest = false
    }
  }

  const rootNodes = Array.from(roots.values())
    .flatMap((name) => collection.get(name))
    .filter(Boolean) as OrbitNode[]
  const tree = createOrbitNode([''], false, rootNodes)
  return tree
}

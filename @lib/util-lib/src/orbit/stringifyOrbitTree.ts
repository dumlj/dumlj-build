import { travelOrbitTree } from './travelOrbitTree'
import { detectLatest } from './detectLatest'
import type { OrbitNode } from './types'

export interface OrbitTreeString {
  orbit: string
  content: string[]
  isLatest: boolean
}

export const stringifyOrbitTree = (tree: OrbitNode) => {
  const orbits: OrbitTreeString[] = []

  travelOrbitTree(tree)((node, chain) => {
    const { path, value, isLatest } = node
    const isRoot = chain.length === 1
    const isBasename = detectLatest(node)
    const isPathname = detectLatest(chain[0])

    const begin = isRoot ? (isBasename && isLatest ? '└' : isPathname ? '└' : '├') : isPathname ? ' ' : '│'
    const orbit = isRoot ? (isLatest ? '─' : '┬') : `${isBasename ? '└' : '├'}─${isLatest ? '──' : '┬─'}`

    const size = chain.length - 2
    const padLeft = (isRoot ? '─' : ' ') + '│ '.repeat(size > 0 ? size : 0)
    const prefix = `${begin}${padLeft}${orbit}`

    orbits.push({ isLatest, orbit: prefix, content: [...path, value] })
  })

  return orbits
}

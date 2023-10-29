import path from 'path'

export interface OrbitNode {
  path: string
  name: string
  isFile: boolean
  children?: Set<OrbitNode>
}

export interface ExtraOrbitNode extends OrbitNode {
  siblings: OrbitNode[]
}

export interface TravelOptions {
  ignoreRoot?: boolean
}

export const travelOrbitTree = (tree: OrbitNode, options?: TravelOptions) => {
  return (handle: (node: ExtraOrbitNode, chain: ExtraOrbitNode[]) => void) => {
    const { ignoreRoot = true } = options || {}
    const walk = (node: ExtraOrbitNode, chain: ExtraOrbitNode[]) => {
      if (!(ignoreRoot && chain.length === 0)) {
        handle(node, chain)
      }

      const { isFile, children } = node
      if (isFile || !(children?.size > 0)) {
        return
      }

      const folders = []
      const files = []

      const names = children.values()
      while (true) {
        const { value: name, done } = names.next()
        if (done) {
          break
        }

        name.isFile ? files.push(name) : folders.push(name)
      }

      const nodes = [...folders, ...files]
      for (const node of [...folders, ...files]) {
        const extra = { ...node, siblings: nodes }
        walk(extra, chain.concat(extra))
      }
    }

    walk({ ...tree, siblings: [] }, [])
  }
}

export const createOrbitNode = (filename: string, isFile: boolean, children: OrbitNode[] = []) => ({
  path: path.dirname(filename),
  name: path.basename(filename),
  isFile,
  children: isFile ? undefined : new Set([...children]),
})

export const mapFileToOrbitTree = (files: string[]) => {
  const collection = new Map<string, OrbitNode>()
  const roots: string[] = []

  for (const file of files) {
    let name = file
    let isFile = true

    while (true) {
      const folder = path.dirname(name)
      if (folder === '.') {
        if (name === file) {
          const node = createOrbitNode(name, isFile)
          collection.set(name, node)
          roots.push(name)
        }

        break
      }

      if (!collection.has(folder)) {
        const node = createOrbitNode(folder, false)
        collection.set(folder, node)

        const isRoot = folder.indexOf('/') === -1
        isRoot && roots.push(folder)
      }

      const parent = collection.get(folder)
      let node = isFile ? createOrbitNode(name, isFile) : collection.get(name)
      if (!node) {
        node = createOrbitNode(name, isFile)
        collection.set(name, node)
      }

      parent.children.add(node)

      name = folder
      isFile = false
    }
  }

  const rootNodes = Array.from(roots.values()).flatMap((name) => collection.get(name))
  const tree = createOrbitNode('.', false, rootNodes)
  return tree
}

export const detectLatest = (node: ExtraOrbitNode) => {
  const { siblings } = node || {}
  const target = siblings?.[siblings?.length - 1]
  if (!target) {
    return false
  }

  return path.join(target.path, target.name) === path.join(node.path, node.name)
}

export interface OrbitTreeString {
  orbit: string
  file: string
  isFile: boolean
}

export const stringifyOrbitTree = (tree: OrbitNode) => {
  const orbits: OrbitTreeString[] = []

  travelOrbitTree(tree)((node, chain) => {
    const { path: folder, name, isFile } = node
    const isRoot = chain.length === 1
    const isLatest = detectLatest(node)
    const isLastFolder = detectLatest(chain[0])

    const begin = isRoot ? (isLatest && isFile ? '└' : isLastFolder ? '└' : '├') : isLastFolder ? ' ' : '│'
    const orbit = isRoot ? (isFile ? '─' : '┬') : `${isLatest ? '└' : '├'}─${isFile ? '──' : '┬─'}`

    const size = chain.length - 2
    const padLeft = (isRoot ? '─' : ' ') + '│ '.repeat(size > 0 ? size : 0)
    const prefix = `${begin}${padLeft}${orbit}`

    orbits.push({ isFile, orbit: prefix, file: path.join(folder, name) })
  })

  return orbits
}

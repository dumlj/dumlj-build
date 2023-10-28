import path from 'path'

export interface OrbitNode {
  path: string
  name: string
  isFile: boolean
  children: Set<string | OrbitNode>
}

export interface ExtraOrbitNode extends OrbitNode {
  siblings: OrbitNode[]
}

export interface TravelOptions {
  ignoreRoot?: boolean
}

export const travelOrbitTree = (tree: OrbitNode, options?: TravelOptions) => {
  return (collection: Map<string, OrbitNode>, handle: (node: ExtraOrbitNode, chain: ExtraOrbitNode[]) => void) => {
    const { ignoreRoot = true } = options || {}
    const walk = (node: ExtraOrbitNode, chain: ExtraOrbitNode[]) => {
      if (!(ignoreRoot && chain.length === 0)) {
        handle(node, chain)
      }

      const { path: folder, name: filename, isFile, children } = node
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

        if (typeof name !== 'string') {
          name.isFile ? files.push(name) : folders.push(name)
          continue
        }

        const key = path.join(folder, filename, name)
        const node = collection.get(key)
        node.isFile ? files.push(node) : folders.push(node)
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

export const createOrbitNode = (filename: string, isFile: boolean, children: Array<string | OrbitNode> = []) => ({
  path: path.dirname(filename),
  name: path.basename(filename),
  isFile,
  children: isFile ? undefined : new Set(children),
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
      const node = isFile ? createOrbitNode(name, isFile) : path.basename(name)
      parent.children.add(node)

      name = folder
      isFile = false
    }
  }

  const rootNodes = Array.from(roots.values()).flatMap((name) => collection.get(name))
  const tree = createOrbitNode('.', false, rootNodes)
  return { roots, collection, tree }
}

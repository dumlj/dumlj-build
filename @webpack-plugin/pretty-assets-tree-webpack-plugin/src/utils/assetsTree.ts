import path from 'path'

export interface Node {
  path: string
  name: string
  isFile: boolean
  children: Set<string | Node>
}

export interface TravelOptions {
  ignoreRoot?: boolean
}

export interface ExtraNode extends Node {
  siblings: Node[]
}

export const travel = (tree: Node, options?: TravelOptions) => (collection: Map<string, Node>, handle: (node: ExtraNode, chain: ExtraNode[]) => void) => {
  const { ignoreRoot = true } = options || {}
  const walk = (node: ExtraNode, chain: ExtraNode[]) => {
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

export const g = (filename: string, isFile: boolean, children: Array<string | Node> = []) => ({
  path: path.dirname(filename),
  name: path.basename(filename),
  isFile,
  children: isFile ? undefined : new Set(children),
})

export const convertAssetsToTree = (files: string[]) => {
  const collection = new Map<string, Node>()
  const roots: string[] = []

  for (const file of files) {
    let name = file
    let isFile = true

    while (true) {
      const folder = path.dirname(name)
      if (folder === '.') {
        if (name === file) {
          const node = g(name, isFile)
          collection.set(name, node)
          roots.push(name)
        }

        break
      }

      if (!collection.has(folder)) {
        const node = g(folder, false)
        collection.set(folder, node)

        const isRoot = folder.indexOf('/') === -1
        isRoot && roots.push(folder)
      }

      const parent = collection.get(folder)
      const node = isFile ? g(name, isFile) : path.basename(name)
      parent.children.add(node)

      name = folder
      isFile = false
    }
  }

  const rootNodes = Array.from(roots.values()).flatMap((name) => collection.get(name))
  const tree = g('.', false, rootNodes)
  return { roots, collection, tree }
}

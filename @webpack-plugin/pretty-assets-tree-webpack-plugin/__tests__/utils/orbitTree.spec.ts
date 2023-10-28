import path from 'path'
import { createOrbitNode, mapFileToOrbitTree, travelOrbitTree } from '@/utils/orbitTree'

describe('test utils/tree', () => {
  describe('test createOrbitNode', () => {
    it('can generate node from file', () => {
      const file = 'location/main.js'
      const node = createOrbitNode(file, true, ['fake'])

      expect(node).toHaveProperty('path', path.dirname(file))
      expect(node).toHaveProperty('name', path.basename(file))
      expect(node).toHaveProperty('isFile', true)
      expect(node).toHaveProperty('children', undefined)
    })

    it('can generate node from folder', () => {
      const folder = 'location/utils'
      const node = createOrbitNode(folder, false, ['main.js'])

      expect(node).toHaveProperty('path', path.dirname(folder))
      expect(node).toHaveProperty('name', path.basename(folder))
      expect(node).toHaveProperty('isFile', false)
      expect(node).toHaveProperty('children', new Set(['main.js']))
    })
  })

  describe('test mapFileToOrbitTree', () => {
    it('can convert array of files to tree', () => {
      const files = ['build/main.js', 'build/services/logger.js', 'build/utils/print.js']
      const { roots, collection, tree } = mapFileToOrbitTree(files)

      expect(roots).toEqual(['build'])

      expect(collection instanceof Map).toBeTruthy()
      expect(Array.from(collection.keys())).toEqual(['build', 'build/services', 'build/utils'])

      const buildNode = collection.get('build')
      const nodes = Array.from(buildNode.children)

      expect(nodes[0]).toHaveProperty('name', 'main.js')
      expect(nodes.includes('services')).toBeTruthy()
      expect(nodes.includes('utils')).toBeTruthy()

      expect(collection.has('build/services')).toBeTruthy()
      expect(Array.from(collection.get('build/services').children)[0]).toHaveProperty('name', 'logger.js')

      expect(collection.has('build/utils')).toBeTruthy()
      expect(Array.from(collection.get('build/utils').children)[0]).toHaveProperty('name', 'print.js')

      expect(tree.path).toEqual('.')
      expect(tree.name).toEqual('.')
      expect(tree.isFile).toEqual(false)
      expect(tree.children instanceof Set).toBeTruthy()
    })
  })

  describe('test travelOrbitTree', () => {
    it('can travel orbit tree', () => {
      const files = ['build/main.js', 'build/services/logger.js', 'build/utils/print.js']
      const { collection, tree } = mapFileToOrbitTree(files)
      travelOrbitTree(tree)(collection, (node) => {
        expect(node).toHaveProperty('path')
        expect(node).toHaveProperty('name')
        expect(node).toHaveProperty('isFile')
        expect(node).toHaveProperty('children')
        expect(node).toHaveProperty('siblings')

        const folders = ['.', 'build', 'build/services', 'build/utils']
        const files = ['.', 'build', 'services', 'utils', 'main.js', 'logger.js', 'print.js']

        expect(folders.includes(node.path)).toBeTruthy()
        expect(files.includes(node.name)).toBeTruthy()
      })
    })
  })
})

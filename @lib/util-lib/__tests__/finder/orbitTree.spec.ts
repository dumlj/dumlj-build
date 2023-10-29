import path from 'path'
import { createOrbitNode, mapFileToOrbitTree, travelOrbitTree, stringifyOrbitTree } from '@/finder/orbitTree'

describe('test utils/tree', () => {
  describe('test createOrbitNode', () => {
    it('can generate node from file', () => {
      const file = 'location/main.js'
      const node = createOrbitNode(file, true)

      expect(node).toHaveProperty('path', path.dirname(file))
      expect(node).toHaveProperty('name', path.basename(file))
      expect(node).toHaveProperty('isFile', true)
      expect(node).toHaveProperty('children', undefined)
    })

    it('can generate node from folder', () => {
      const folder = 'location/utils'
      const node = createOrbitNode(folder, false, [
        {
          path: 'build',
          name: 'main.js',
          isFile: false,
        },
      ])

      expect(node).toHaveProperty('path', path.dirname(folder))
      expect(node).toHaveProperty('name', path.basename(folder))
      expect(node).toHaveProperty('isFile', false)
      expect(node).toHaveProperty(
        'children',
        new Set([
          {
            path: 'build',
            name: 'main.js',
            isFile: false,
          },
        ])
      )
    })
  })

  describe('test mapFileToOrbitTree', () => {
    it('can convert array of files to tree', () => {
      const files = ['build/main.js', 'build/services/logger.js', 'build/utils/print.js']
      const tree = mapFileToOrbitTree(files)

      expect(tree.path).toEqual('.')
      expect(tree.name).toEqual('.')
      expect(tree.isFile).toEqual(false)
      expect(tree.children instanceof Set).toBeTruthy()
    })
  })

  describe('test travelOrbitTree', () => {
    it('can travel orbit tree', () => {
      const files = ['build/main.js', 'build/services/logger.js', 'build/utils/print.js']
      const tree = mapFileToOrbitTree(files)
      travelOrbitTree(tree)((node) => {
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

  describe('test stringifyOrbitTree', () => {
    it('can stringify orbit tree', () => {
      const files = ['build/main.js', 'build/services/logger.js', 'build/utils/print.js']
      const tree = mapFileToOrbitTree(files)
      const messages = stringifyOrbitTree(tree)

      expect(messages).toEqual([
        { orbit: '└─┬', file: 'build', isFile: false },
        { orbit: '  ├─┬─', file: 'build/services', isFile: false },
        { orbit: '  │ └───', file: 'build/services/logger.js', isFile: true },
        { orbit: '  ├─┬─', file: 'build/utils', isFile: false },
        { orbit: '  │ └───', file: 'build/utils/print.js', isFile: true },
        { orbit: '  └───', file: 'build/main.js', isFile: true },
      ])
    })
  })
})

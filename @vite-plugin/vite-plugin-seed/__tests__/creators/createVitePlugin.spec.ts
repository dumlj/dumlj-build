import { createVitePlugin, createVitePluginEnhancers } from '@/creators/createVitePlugin'

describe('test creators/createVitePlugin', () => {
  describe('test createVitePlugin', () => {
    it('can create a vite plugin factory', () => {
      const NAME = 'vitePlugin'
      const ENHANCERS = { a: 1, b: 2 }

      let nestEnhancers: typeof ENHANCERS
      const enhanceFn = jest.fn((ENHANCERS) => {
        nestEnhancers = ENHANCERS
        return {}
      })

      let nestParams: [number, string]
      const factoryFn = jest.fn((a: number, b: string) => {
        nestParams = [a, b]
        return enhanceFn
      })
      const factory = createVitePlugin(NAME, factoryFn)
      expect(typeof factory).toBe('function')

      const plugin = factory(() => ENHANCERS)
      expect(typeof plugin).toBe('function')

      expect(plugin(1, '1')).toEqual({ name: 'vite-plugin' })
      expect(factoryFn).toHaveBeenCalled()
      expect(enhanceFn).toHaveBeenCalled()
      expect(nestParams).toEqual([1, '1'])
      expect(nestEnhancers).toEqual(ENHANCERS)
    })
  })

  describe('test createVitePluginEnhancers', () => {
    it('can return connect and enhance methods', () => {
      const enhancer = createVitePluginEnhancers()
      expect(enhancer).toHaveProperty('connect')
      expect(enhancer).toHaveProperty('enhance')
    })

    it('can add enhancers through enhance method', () => {
      const originEnhancers = {
        a: () => {},
      }

      const expandEnhancers = {
        b: () => {},
      }

      const { enhance } = createVitePluginEnhancers(originEnhancers)
      const enhancer = enhance(expandEnhancers)
      expect(enhancer).toHaveProperty('connect')
      expect(enhancer).toHaveProperty('enhance')

      const buildEnd = () => {}

      let nestEnhancers: { a?: () => void; b?: () => void }
      const { connect } = enhancer
      const factory = jest.fn(
        createVitePlugin('vite', (a: number, b: string) => (enhancers) => {
          nestEnhancers = enhancers
          return { a, b, buildEnd }
        })
      )

      const plugin = connect(factory)
      expect(factory).toHaveBeenCalled()
      expect(typeof plugin).toBe('function')
      expect(plugin(1, '1')).toEqual({ name: 'vite', a: 1, b: '1', buildEnd })

      const mergeEnhancers = ((mergeEnhancers) => {
        return Object.keys(mergeEnhancers).reduce((enhancers, name) => {
          enhancers[name] = mergeEnhancers[name]()
          return enhancers
        }, {})
      })({ ...originEnhancers, ...expandEnhancers })
      expect(nestEnhancers).toEqual(mergeEnhancers)
    })
  })
})

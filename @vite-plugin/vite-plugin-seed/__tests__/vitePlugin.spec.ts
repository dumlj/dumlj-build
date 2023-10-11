import { vitePlugin, PLUGIN_NAME, connect } from '@/vitePlugin'
import { createVitePlugin } from '@/creators/createVitePlugin'

describe('test vitePlugin', () => {
  it('can be calling', () => {
    const instance = vitePlugin()
    expect(instance).toHaveProperty('name', PLUGIN_NAME)
    expect(instance).toHaveProperty('buildEnd')
  })

  it('can be inherited by calling vitePlugin', () => {
    const plugin = connect(
      createVitePlugin('a', () => () => {
        const instance = vitePlugin()

        return {
          buildEnd() {
            instance.buildEnd.call(this)
          },
        }
      })
    )

    expect(typeof plugin).toBe('function')

    const instance = plugin()
    expect(instance).toHaveProperty('name', 'a')
    expect(instance).toHaveProperty('buildEnd')
  })
})

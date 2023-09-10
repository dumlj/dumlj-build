import { OutdatedWebpackPlugin } from '@/plugins/OutdatedWebpackPlugin'
import { SeedWebpackPlugin } from '@/plugins/SeedWebpackPlugin'
import type { Compiler } from 'webpack'
import webpack from 'webpack'

describe('test plugins/SeedWebpackPlugin', () => {
  it('is has apply method.', async () => {
    const instance = new SeedWebpackPlugin()
    expect(instance.pluginName).toBe('seed-webpack-plugin')
    expect(instance).toHaveProperty('apply')
    expect(instance).toHaveProperty('options')
    expect(instance).toHaveProperty('verbose')
    expect(instance).toHaveProperty('silence')
    expect(instance).toHaveProperty('messages')
  })

  it('is will push outdate plugin', async () => {
    const plugins = []
    await new Promise<void>((resolve, reject) => {
      webpack(
        {
          plugins: [
            {
              apply(compiler: Compiler) {
                const instance = new SeedWebpackPlugin()
                instance.apply(compiler)
                plugins.push(...compiler.options.plugins)
              },
            },
          ],
        },
        (error) => {
          if (error) {
            reject(error)
            return
          }

          resolve()
        }
      )
    })

    expect(plugins.find((plugin) => plugin instanceof OutdatedWebpackPlugin)).not.toBeUndefined()
  })

  it('can be inherited by custom plugin', async () => {
    class CustomWebpackPlugin extends SeedWebpackPlugin {
      static PLUGIN_NAME = 'custom-webpack-plugin'
    }

    const instance = new CustomWebpackPlugin()
    expect(instance.pluginName).toBe('custom-webpack-plugin')
  })
})

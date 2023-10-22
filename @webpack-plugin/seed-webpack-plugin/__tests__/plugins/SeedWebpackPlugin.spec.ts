import { promisify } from 'util'
import { OutdatedWebpackPlugin } from '@/plugins/OutdatedWebpackPlugin'
import { SeedWebpackPlugin } from '@/plugins/SeedWebpackPlugin'
import { mockWebpack } from '@dumlj/mock-lib'
import type { Compiler } from 'webpack'

describe('test plugins/SeedWebpackPlugin', () => {
  const webpack = mockWebpack({
    '/index.js': 'console.log("hi world")',
  })

  it('is has a `apply` method.', async () => {
    const instance = new SeedWebpackPlugin()
    expect(instance.pluginName).toBe('seed-webpack-plugin')
    expect(instance).toHaveProperty('apply')
    expect(instance).toHaveProperty('options')
    expect(instance).toHaveProperty('verbose')
    expect(instance).toHaveProperty('silence')
    expect(instance).toHaveProperty('messages')
  })

  it('is will push outdate plugin.', async () => {
    const { compiler } = await webpack({ plugins: [new SeedWebpackPlugin()] })
    await promisify(compiler.run.bind(compiler))()
    expect(compiler.options.plugins.find((plugin) => plugin instanceof OutdatedWebpackPlugin)).not.toBeUndefined()
  })

  it('can be inherited by custom plugin.', async () => {
    class CustomWebpackPlugin extends SeedWebpackPlugin {
      static PLUGIN_NAME = 'custom-webpack-plugin'
    }

    const instance = new CustomWebpackPlugin()
    expect(instance.pluginName).toBe('custom-webpack-plugin')
  })

  it('can push messages to notification.', async () => {
    class CustomWebpackPlugin extends SeedWebpackPlugin {
      static PLUGIN_NAME = 'custom-webpack-plugin'
      public apply(compiler: Compiler) {
        super.apply(compiler)

        this.notify('info', 'info')
        this.notify('warn', 'warn')
        this.notify('error', 'error')
      }

      public get expectMessages() {
        return this.messages
      }
    }

    const instance = new CustomWebpackPlugin()
    await webpack({ plugins: [instance] })
    expect(instance.expectMessages.length).toBe(3)
    expect(instance.expectMessages[0]).toStrictEqual({ type: 'info', message: 'info' })
    expect(instance.expectMessages[1]).toStrictEqual({ type: 'warn', message: 'warn' })
    expect(instance.expectMessages[2]).toStrictEqual({ type: 'error', message: 'error' })
  })
})

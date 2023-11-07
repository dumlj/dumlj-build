import path from 'path'
import { createDumiPlugin } from '@dumlj/dumi-plugin-seed'
import { InjectEntryScriptWebpackPlugin } from '@dumlj/inject-entry-script-webpack-plugin'
import { store, compileWorkspace, type CompileWorkspaceOptions, DEFAULT_TEMPLATE_FILE_NAME } from '@dumlj/feature-readme'

export interface MonoReadmeOptions extends Omit<CompileWorkspaceOptions, 'cwd' | 'config'> {
  config?: string
}

export default createDumiPlugin<MonoReadmeOptions>('monoReadme', async (api, { getOptions, regsiterComponent, pushWebpackPlugin }) => {
  const { name, cwd } = api
  const { config: configFile, template = DEFAULT_TEMPLATE_FILE_NAME, banner, include, exclude, paths } = getOptions()
  const state = store.getState()
  const compile = () => compileWorkspace({ configFile, template, cwd, banner, include, exclude, paths })

  /**
   * 因为 regsiterComponent render 只能使用同步执行
   * 因此需要在下一次 compile 之前重新编译渲染函数
   *
   * Since registerComponent render can only be executed synchronously,
   * the rendering function needs to be recompiled before the next compilation.
   */
  let renderers = await compile()
  pushWebpackPlugin(name, {
    apply(compiler) {
      compiler.hooks.beforeCompile.tapPromise(name, async () => {
        if (compiler.modifiedFiles) {
          const modifiedFiles = Array.from(compiler.modifiedFiles.values())
          const files = modifiedFiles.filter((file) => state.has(file))
          if (files.length !== modifiedFiles.length) {
            renderers = await compile()
            return
          }

          await Promise.all(files.map((file) => store.updateRender(file)))
        }
      })
    },
  })

  pushWebpackPlugin(`${name}/webComponent`, {
    apply(compiler) {
      const { webpack } = compiler
      new webpack.DefinePlugin({ __OUTPUT_PATH__: JSON.stringify(api.userConfig.outputPath) }).apply(compiler)
      new InjectEntryScriptWebpackPlugin(path.join(__dirname, 'web-components/link')).apply(compiler)
    },
  })

  regsiterComponent({
    tag: 'embed-project',
    render({ attributes, parseAST, vFile }) {
      if (!(renderers && renderers.size > 0)) {
        api.logger.warn('No projects found.')
        return
      }

      const { src } = attributes
      const render = renderers.get(src)
      if (typeof render !== 'function') {
        return ''
      }

      vFile.data.embeds.push(...Array.from(state.keys()))

      const code = render()
      return parseAST(code)
    },
  })
})

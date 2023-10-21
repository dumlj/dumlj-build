import { createDumiPlugin } from '@dumlj/dumi-plugin-seed'
import { compileWorkspace, type CompileWorkspaceOptions } from '@dumlj/feature-readme'

export interface MonoReadmeOptions extends Omit<CompileWorkspaceOptions, 'cwd' | 'config'> {
  config?: string
}

export default createDumiPlugin<MonoReadmeOptions>('monoReadme', async (api, { regsiterComponent, getOptions }) => {
  const { cwd } = api
  const { config: configFile, template, banner, include, exclude, paths } = getOptions()
  const renderers = await compileWorkspace({ configFile, template, cwd, banner, include, exclude, paths })
  if (!(renderers && renderers.size > 0)) {
    api.logger.warn('No projects found.')
    return
  }

  regsiterComponent({
    tag: 'embed-project',
    render({ attributes, parseAST }) {
      const { src } = attributes
      const { render } = renderers.get(src)
      if (typeof render !== 'function') {
        return ''
      }

      const ast = parseAST(render())
      return ast
    },
  })
})

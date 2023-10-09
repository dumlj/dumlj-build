/* eslint-disable import/no-extraneous-dependencies */
import camelCase from 'lodash/camelCase'
import kebabCase from 'lodash/kebabCase'
import type { TemplateSchema } from '@dumlj/create-cli'

export const configure = async (): Promise<TemplateSchema> => {
  const alias = (name: string) => camelCase(name).replace(/^[a-z]/, (char) => char.toUpperCase())
  const nameClass = (name: string) => `${alias(name)}WebpackPlugin`
  const nameOptions = (name: string) => `${alias(name)}WebpackPluginOptions`
  const namePlugin = (name: string) => kebabCase(`${name}-webpack-plugin`)
  const nameModule = (name: string) => `@dumlj/${kebabCase(`${name}-webpack-plugin`)}`
  const nameDirectory = (name: string) => `@webpack-plugin/${kebabCase(`${name}-webpack-plugin`)}`

  return {
    name: 'Webpack Plugin Template',
    description: 'Create a webpack plugin which inherits seed-webpack-plugin.',
    outputPathResolver: (kebabCaseName: string) => `@webpack-plugin/${kebabCaseName}-webpack-plugin/`,
    pkgTransform: async ({ name, description, source }) => {
      source.name = nameModule(name)
      source.description = description
      source.repository.directory = nameDirectory(name)
    },
    tsTransform: async ({ name, ast, file }) => {
      switch (file) {
        case 'src/WebpackPlugin.ts': {
          const nOptions = ast.getInterfaceOrThrow('WebpackPluginOptions')
          nOptions.rename(nameOptions(name))

          const nClass = ast.getClassOrThrow('WebpackPlugin')
          nClass.rename(nameClass(name))

          const nPluginName = nClass.getStaticProperty('PLUGIN_NAME')!
          nPluginName.set({ initializer: JSON.stringify(namePlugin(name)) })
          return { output: `src/${nameClass(name)}.ts` }
        }

        case 'src/index.ts': {
          const declarations = ast.getExportDeclarations()
          const declaration = declarations.find((d) => d.getModuleSpecifier()!.getLiteralText() === './WebpackPlugin')!
          declaration.setModuleSpecifier(`./${nameClass(name)}`)
          return
        }
      }
    },
  }
}

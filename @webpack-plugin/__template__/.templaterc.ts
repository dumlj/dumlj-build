/* eslint-disable import/no-extraneous-dependencies */
import { upperFirst, camelCase, kebabCase } from 'lodash'
import type { TemplateSchema } from '@dumlj/create-cli'

export const configure = async (): Promise<TemplateSchema> => {
  const alias = (name: string) => upperFirst(camelCase(name))
  const nameClass = (name: string) => `${alias(name)}WebpackPlugin`
  const nameOptions = (name: string) => `${alias(name)}WebpackPluginOptions`
  const namePlugin = (name: string) => `${kebabCase(name)}-webpack-plugin`
  const nameModule = (name: string) => `@dumlj/${kebabCase(name)}-webpack-plugin`
  const nameDirectory = (name: string) => `@webpack-plugin/${kebabCase(name)}-webpack-plugin`

  return {
    name: 'Webpack Plugin Template',
    description: 'Create a webpack plugin which inherits seed-webpack-plugin.',
    nameTransform: (input: string) => {
      const SUFFIX_NAME = 'WebpackPlugin'

      let length = 0
      while (true) {
        if (SUFFIX_NAME.length === length) {
          break
        }

        const t = SUFFIX_NAME.substring(0, length + 1)
        if (new RegExp(t, 'i').test(input)) {
          length++
          continue
        }

        break
      }

      const suffixSameStr = SUFFIX_NAME.substring(0, length)
      const nameSameStr = input.substring(input.length - length)
      if (suffixSameStr.toUpperCase() !== nameSameStr.toUpperCase()) {
        return { shortName: input, name: nameClass(input), same: '', suffix: SUFFIX_NAME }
      }

      const shortName = input.substring(0, input.length - nameSameStr.length)
      const name = alias(`${shortName}${SUFFIX_NAME}`)
      const suffix = SUFFIX_NAME.substring(length)
      return { shortName, name, same: suffixSameStr, suffix }
    },
    outputPathResolver: (kebabCaseName: string) => `@webpack-plugin/${kebabCase(kebabCaseName)}-webpack-plugin/`,
    pkgTransform: () => {
      return async ({ name, description, source }) => {
        source.name = nameModule(name)
        source.description = description
        source.repository.directory = nameDirectory(name)
      }
    },
    tsTransform: (file) => {
      switch (file) {
        case 'src/WebpackPlugin.ts':
          return async ({ name, ast }) => {
            const nOptions = ast.getInterfaceOrThrow('WebpackPluginOptions')
            nOptions.rename(nameOptions(name))

            const nClass = ast.getClassOrThrow('WebpackPlugin')
            nClass.rename(nameClass(name))

            const nPluginName = nClass.getStaticProperty('PLUGIN_NAME')!
            nPluginName.set({ initializer: JSON.stringify(namePlugin(name)) })
            return { output: `src/${nameClass(name)}.ts` }
          }

        case 'src/index.ts':
          return async ({ name, ast }) => {
            const declarations = ast.getExportDeclarations()
            const declaration = declarations.find((d) => d.getModuleSpecifier()!.getLiteralText() === './WebpackPlugin')!
            declaration.setModuleSpecifier(`./${nameClass(name)}`)
            return
          }
      }
    },
  }
}

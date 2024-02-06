/* eslint-disable import/no-extraneous-dependencies */

import path from 'path'
import { upperFirst, camelCase, kebabCase } from 'lodash'
import { SyntaxKind, type TemplateSchema } from '@dumlj/create-cli'

const configureCli = async (): Promise<TemplateSchema> => {
  const alias = (name: string) => upperFirst(camelCase(name))
  const nameClass = (name: string) => `${alias(name)}Cli`
  const nameModule = (name: string) => `@dumlj/${kebabCase(`${name}-cli`)}`
  const nameDirectory = (name: string) => `@cli/${kebabCase(`${name}-cli`)}`
  const folder = path.join(__dirname, '@cli')

  return {
    template: path.join(folder, '__template__'),
    output: folder,
    name: 'Cli Template',
    description: 'Create a cli which inherits seed-cli.',
    egName: 'CustomCli',
    nameTransform: (input: string) => {
      const SUFFIX_NAME = 'Cli'

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
    outputPathResolver: (kebabCaseName: string) => nameDirectory(kebabCaseName),
    pkgTransform: () => {
      return async ({ name, description, source }) => {
        source.name = nameModule(name)
        source.description = description
        source.repository.directory = nameDirectory(name)
      }
    },
    tsTransform: (file) => {
      switch (file) {
        case 'src/actions/entry.ts': {
          return async ({ name, ast }) => {
            const iOptions = ast.getInterfaceOrThrow('EntryOptions')
            iOptions.rename(`${upperFirst(name)}Options`)

            const iConst = ast.getVariableDeclarationOrThrow('entry')
            iConst.rename(name)

            return { output: `src/actions/${name}.ts` }
          }
        }

        case 'src/commands/entry.ts': {
          return async ({ name, ast }) => {
            const declaration = ast.getImportDeclarationOrThrow('../actions/entry')
            declaration.setModuleSpecifier(`../actions/${name}`)

            const imports = declaration.getNamedImports()
            const vEntry = imports.find((item) => item.getName() === 'entry')
            const vEntryOptions = imports.find((item) => item.getName() === 'EntryOptions')

            vEntry?.getNameNode().rename(name)
            vEntryOptions?.getNameNode().rename(`${upperFirst(name)}Options`)

            vEntry?.setName(name).removeAlias()
            vEntryOptions?.setName(`${upperFirst(name)}Options`).removeAlias()

            for (const callExpression of ast.getDescendantsOfKind(SyntaxKind.CallExpression)) {
              callExpression
                .getArguments()
                .find((arg) => arg.getText() === `'entry'`)
                ?.replaceWithText(`'${name}'`)
            }

            return { output: `src/commands/${name}.ts` }
          }
        }

        case 'src/index.ts': {
          return async ({ name, ast }) => {
            const declarations = ast.getExportDeclarations()
            const declaration = declarations.find((d) => d.getModuleSpecifier()!.getLiteralText() === './commands/entry')!
            declaration.setModuleSpecifier(`./commands/${name}`)

            const entry = declaration.getNamedExports().find((item) => item.getAliasNode()?.getText() === 'entry')
            entry?.getAliasNode()?.rename(name)

            return
          }
        }
      }
    },
  }
}

const configureFeature = async (): Promise<TemplateSchema> => {
  const nameModule = (name: string) => `@dumlj/feature-${kebabCase(name)}`
  const nameDirectory = (name: string) => `@feature/feature-${kebabCase(name)}`
  const folder = path.join(__dirname, '@feature')

  return {
    template: path.join(folder, '__template__'),
    output: folder,
    name: 'Feature Template',
    description: 'Create a common features.',
    outputPathResolver: (kebabCaseName: string) => nameDirectory(kebabCaseName),
    pkgTransform: () => {
      return async ({ name, description, source }) => {
        source.name = nameModule(name)
        source.description = description
        source.repository.directory = nameDirectory(name)
      }
    },
  }
}

const configureWebpack = async (): Promise<TemplateSchema> => {
  const alias = (name: string) => upperFirst(camelCase(name))
  const nameClass = (name: string) => `${alias(name)}WebpackPlugin`
  const nameOptions = (name: string) => `${alias(name)}WebpackPluginOptions`
  const namePlugin = (name: string) => `${kebabCase(name)}-webpack-plugin`
  const nameModule = (name: string) => `@dumlj/${kebabCase(name)}-webpack-plugin`
  const nameDirectory = (name: string) => `@webpack-plugin/${kebabCase(name)}-webpack-plugin`
  const folder = path.join(__dirname, '@webpack-plugin')

  return {
    template: path.join(folder, '__template__'),
    output: folder,
    name: 'Webpack Plugin Template',
    description: 'Create a webpack plugin which inherits seed-webpack-plugin.',
    egName: 'CustomWebpackPlugin',
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
    outputPathResolver: (kebabCaseName: string) => nameDirectory(kebabCaseName),
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

export const configure = async () => {
  return [await configureCli(), await configureFeature(), await configureWebpack()]
}

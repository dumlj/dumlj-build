/* eslint-disable import/no-extraneous-dependencies */
import { upperFirst, camelCase, kebabCase } from 'lodash'
import type { TemplateSchema } from '@dumlj/create-cli'
import { SyntaxKind } from 'ts-morph'

export const configure = async (): Promise<TemplateSchema> => {
  const alias = (name: string) => upperFirst(camelCase(name))
  const nameClass = (name: string) => `${alias(name)}Cli`
  const nameModule = (name: string) => `@dumlj/${kebabCase(`${name}-cli`)}`
  const nameDirectory = (name: string) => `@cli/${kebabCase(`${name}-cli`)}`

  return {
    name: 'Cli Template',
    description: 'Create a cli which inherits seed-cli.',
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
    outputPathResolver: (kebabCaseName: string) => `@cli/${kebabCaseName}-cli/`,
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
            const iOptions = ast.getInterfaceOrThrow('entryOptions')
            iOptions.rename(`${name}Options`)

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
            const vEntryOptions = imports.find((item) => item.getName() === 'entryOptions')

            vEntry?.getNameNode().rename(name)
            vEntryOptions?.getNameNode().rename(`${name}Options`)

            vEntry?.setName(name).removeAlias()
            vEntryOptions?.setName(`${name}Options`).removeAlias()

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

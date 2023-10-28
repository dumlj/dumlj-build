/* eslint-disable import/no-extraneous-dependencies */
import { kebabCase } from 'lodash'
import type { TemplateSchema } from '@dumlj/create-cli'

export const configure = async (): Promise<TemplateSchema> => {
  const nameModule = (name: string) => `@dumlj/feature-${kebabCase(name)}`
  const nameDirectory = (name: string) => `@feature/feature-${kebabCase(name)}`

  return {
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

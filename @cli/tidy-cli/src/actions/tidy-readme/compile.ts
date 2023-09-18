import fs from 'fs-extra'
import handlebars from 'handlebars'
import { lookupTemplate } from './lookupTemplate'

export interface CompileParams {
  paths: string[]
  parts: string[]
}

export const compile = async (params: CompileParams) => {
  const { paths, parts } = params
  const renders = await Promise.all(
    parts.map(async (name) => {
      const template = await lookupTemplate(name, paths)
      if (!template) {
        return
      }

      const source = (await fs.readFile(template)).toString()
      const render = handlebars.compile(source)
      return render
    })
  )

  return renders.filter(Boolean)
}

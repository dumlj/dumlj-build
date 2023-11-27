import fs from 'fs-extra'
import handlebars from 'handlebars'

export type Render = (data?: Record<string, any>) => string

/**
 * global renderers
 * @description
 * key is the name of markdown
 */
const GLOBAL_RENDERS = new Map<string, Render>()

export const existsRender = (file: string) => GLOBAL_RENDERS.has(file)

export const getRender = (file: string) => GLOBAL_RENDERS.get(file)

export const clearRender = () => GLOBAL_RENDERS.clear()

export const getState = () => GLOBAL_RENDERS

export const compileFile = async (file: string) => {
  const source = (await fs.readFile(file)).toString('utf-8')
  return handlebars.compile(source)
}

export const updateRender = async (file: string) => {
  const render = await compileFile(file)
  GLOBAL_RENDERS.set(file, render)
  return render
}

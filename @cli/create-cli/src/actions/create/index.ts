import type { CreateOptions } from './create'
import { Create } from './create'

export type { CreateOptions }

export const create = async (options?: CreateOptions) => {
  return new Create(options).create()
}

export const debug = async (options?: CreateOptions) => {
  return new Create(options).debug()
}

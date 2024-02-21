import type { Loader } from '../types'

export function isLoader(target: Record<string, any>): target is Loader {
  if ('loader' in target && typeof target.loader === 'string') {
    try {
      require.resolve(target.loader)
      return true
    } catch {
      /** nothing todo... */
    }
  }

  return false
}

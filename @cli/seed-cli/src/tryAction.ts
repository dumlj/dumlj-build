import { fail } from '@dumlj/feature-pretty'
import { yellOutdateds } from './utils/yellOutdateds'

export function tryAction<A extends (...args: any[]) => Promise<any>>(handle: A) {
  return async function execute(...args: Parameters<A>) {
    await yellOutdateds()

    try {
      return handle(...args)
    } catch (error) {
      fail(error as Error)
    }
  }
}

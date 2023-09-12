import { fail } from '@dumlj/feature-pretty'
import { yellOutdateds } from './utils/yellOutdateds'

export const tryAction = <A extends (...args: any[]) => Promise<any>>(handle: A) => {
  return (...args: Parameters<A>) => {
    yellOutdateds()

    try {
      return handle(...args)
    } catch (error) {
      fail(error)
    }
  }
}

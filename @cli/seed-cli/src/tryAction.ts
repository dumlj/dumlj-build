import { fail } from '@dumlj/feature-pretty'
import { yellOutdateds } from './utils/yellOutdateds'

export const tryAction =
  <A extends (...args: any[]) => Promise<any>>(handle: A) =>
  async (...args: Parameters<A>) => {
    await yellOutdateds()

    try {
      return handle(...args)
    } catch (error) {
      fail(error)
    }
  }

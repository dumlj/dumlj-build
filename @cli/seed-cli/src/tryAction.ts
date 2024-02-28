import { fail } from '@dumlj/feature-pretty'
import { yellOutdateds } from './utils/yellOutdateds'

const DEFAULT_CHECK_OUTDATED = process.argv.includes('--check-outdated') || false

export interface Options {
  checkOutdated?: boolean
}

export function tryAction<A extends (...args: any[]) => Promise<any>>(handle: A, options?: Options) {
  return async function execute(...args: Parameters<A>) {
    const { checkOutdated = DEFAULT_CHECK_OUTDATED } = options || {}
    checkOutdated === true && (await yellOutdateds())

    try {
      return handle(...args)
    } catch (error) {
      fail(error as Error)
    }
  }
}

import { info } from '@dumlj/feature-pretty'

export interface entryOptions {
  verbose?: boolean

  /**
   * @todo
   * add some plugin options
   */
}

export const entry = async (options?: entryOptions) => {
  const { verbose } = options || {}
  info('This is an example cli', { verbose })

  /**
   * please remove these comments
   *
   * @todo
   * add some action logic code
   */
}

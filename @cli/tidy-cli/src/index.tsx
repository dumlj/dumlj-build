import type { ReadmeConfiguration as Configuration } from '@dumlj/feature-readme'

export interface ReadmeConfiguration extends Configuration {
  /** 多语言 */
  locals: string[]
}

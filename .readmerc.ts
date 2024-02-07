import type { ReadmeConfiguration } from '@dumlj/tidy-cli'

export const configure: ReadmeConfiguration = async () => {
  return {
    locals: ['zh-CN'],
  }
}

import type { ReadmeConfiguration } from '@dumlj/tidy-cli'

export const configure: ReadmeConfiguration = async () => {
  const helpers = {
    abc: (name: string) => {
      return name
    },
  }

  const metadatas = {
    data: async () => 'abc',
  }

  return { helpers, metadatas }
}

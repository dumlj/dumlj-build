import path from 'path'
import * as prettier from 'prettier'
import { findWorkspaceRootPath } from '@dumlj/util-lib'

export interface PrettyOptions {
  paths?: string[]
}

export const pretty = async (code: string, options?: PrettyOptions) => {
  const { paths } = options
  const rootPath = (await findWorkspaceRootPath({ paths })) || process.cwd()

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const prettierOptions = require(path.join(rootPath, '.prettierrc'))
  return prettier.format(code, {
    parser: 'markdown',
    ...prettierOptions,
  })
}

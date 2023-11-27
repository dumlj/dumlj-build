import { trimEnd, trimStart } from 'lodash'

declare const __webpack_public_path__: string | (() => string)

export const withPublicPath = (url: string) => {
  const baseUrl = typeof __webpack_public_path__ === 'function' ? __webpack_public_path__() : __webpack_public_path__
  return trimEnd(baseUrl, '/') + '/' + trimStart(url, '/')
}

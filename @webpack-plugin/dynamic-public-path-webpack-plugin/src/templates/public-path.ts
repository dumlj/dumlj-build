import { trimUrlPathEnd } from '../utils/trimUrl'

declare let __webpack_public_path__: string

/**
 * __DYNAMIC_CDN_TARGET__, __DYNAMIC_CDN_PROP_POINTER__, __DYNAMIC_CDN_PROP_NAME__
 * 均为编译时动态注入，所以请勿引入
 * PUBLIC_PATH 则是固定
 */
/* eslint-disable-next-line */
__webpack_public_path__ = `${trimUrlPathEnd(process.env.__DYNAMIC_PUBLIC_PATH__ || '')}/`

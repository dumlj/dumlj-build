declare const __GLOBAL_TARGET__: string
declare const __GLOBAL_PROP_FN__: string
declare const __GLOBAL_PROP_NAME__: string

/**
 * __GLOBAL_TARGET__, __GLOBAL_PROP_FN__, __GLOBAL_PROP_NAME__
 * 三个变量均为编译时动态注入，所以请勿引入
 */
if (!__GLOBAL_TARGET__[__GLOBAL_PROP_FN__]) {
  Object.defineProperty(__GLOBAL_TARGET__, __GLOBAL_PROP_FN__, {
    writable: false,
    enumerable: false,
    configurable: false,
    value(name: string, defaultValue: any) {
      if (typeof __GLOBAL_TARGET__?.[__GLOBAL_PROP_NAME__] !== 'undefined') {
        if (typeof __GLOBAL_TARGET__[__GLOBAL_PROP_NAME__]?.[name] !== 'undefined') {
          return __GLOBAL_TARGET__[__GLOBAL_PROP_NAME__][name]
        }
      }

      return defaultValue
    },
  })
}

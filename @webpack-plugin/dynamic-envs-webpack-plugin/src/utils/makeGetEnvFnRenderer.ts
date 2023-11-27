import { GLOBAL_TARGET } from '../constants/conf'

export const makeGetEnvFnRenderer =
  (globalThisFn: string, globalThis: string = GLOBAL_TARGET) =>
  ([]: TemplateStringsArray, key: string, value?: any) => {
    return `${globalThis}.${globalThisFn}(${key}${typeof value !== 'undefined' ? `,${value}` : ''})`
  }

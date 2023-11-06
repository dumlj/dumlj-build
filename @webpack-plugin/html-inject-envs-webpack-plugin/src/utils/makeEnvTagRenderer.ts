import { GLOBAL_TARGET } from '../constants/conf'

/** 环境变量 */
export const makeEnvTagRenderer =
  (globalThisProp: string, globalThis: string = GLOBAL_TARGET) =>
  ([]: TemplateStringsArray, value: string) => {
    return `if(!${globalThis}.${globalThisProp}){Object.defineProperty(${globalThis},"${globalThisProp}",{writable:false,configurable:false,enumerable:true,value:${value}})}`
  }

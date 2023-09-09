import { excute as originExcute, excuteSync as originExcuteSync } from '../helpers/excute'
import type { TrimPromise } from '../typings/trim-promise'

/**
 * 预处理
 * @description
 * 可以作为前置检测
 */
type Preprocess<R = any> = (excute: () => R) => R

/**
 * 输入的命令行函数
 * @description
 * 因为大部分情况下都是通过命令行改变参数，
 * 因此将命令行设置成函数形式，就可以动态生成执行函数的输入参数
 */
type Comamnd = (...params: any[]) => string

/**
 * 结果处理函数
 * @description
 * 因为命令行返回均为字符串，
 * 所以大部分情况都需要进行数据处理
 */
type Resolve = (stdout: string, isSync: boolean) => any

export const createExcutor = (preprocess: Preprocess) => {
  return <C extends Comamnd, R extends Resolve>(command: C, resolv?: R) => {
    type Params = Parameters<C>
    type Response = TrimPromise<ReturnType<R>>

    /** 异步 */
    const excute = async (...params: Params): Promise<Response> => {
      const stdout = (await preprocess(() => originExcute(command(...params)))) || ''
      const response = stdout.toString().trim()
      return typeof resolv === 'function' ? resolv(response, false) : stdout
    }

    /** 同步 */
    excute.sync = (...params: Params): Response => {
      const stdout = preprocess(() => originExcuteSync(command(...params))) || ''
      const response = stdout.toString().trim()
      return typeof resolv === 'function' ? resolv(response, true) : stdout
    }

    return excute
  }
}

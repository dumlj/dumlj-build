import type { ExecOptions, ExecSyncOptions } from 'child_process'
import { excute as originExcute, excuteSync as originExcuteSync } from '../helpers/excute'
import type { TrimPromise } from '../utility-types/trim-promise'

/**
 * 预处理
 * @description
 * 可以作为前置检测
 */
export type Preprocess<R = any> = (excute: () => R) => R

/**
 * 输入的命令行函数
 * @description
 * 因为大部分情况下都是通过命令行改变参数，
 * 因此将命令行设置成函数形式，就可以动态生成执行函数的输入参数
 */
export type Comamnd = (...params: any[]) => string

/**
 * 结果处理函数
 * @description
 * 因为命令行返回均为字符串，
 * 所以大部分情况都需要进行数据处理
 */
export type Resolve = (stdout: string, isSync: boolean) => unknown

export const createExcutor = (preprocess: Preprocess) => {
  return <C extends Comamnd, R extends Resolve>(command: C, resolv?: R) => {
    type Params = Parameters<C>
    type Response = TrimPromise<ReturnType<R>> extends infer P ? (unknown extends P ? string : P) : never

    const options = (options?: ExecOptions) => {
      const exec = async (...params: Params): Promise<Response> => {
        const stdout = (await preprocess(() => originExcute(command(...params), options))) || ''
        const response = stdout.toString().trim()
        /**
         * resolv 可能为异步也可能不为异步，
         * 但是 excute 本身为异步函数 promise，
         * 则返回 promise 会返回结果值，无需单独处理
         */
        const result = typeof resolv === 'function' ? resolv(response, false) : stdout
        return result
      }

      return { exec }
    }

    /** 异步 */
    const excute = (...params: Params) => options().exec(...params)
    excute.options = options

    const optionsSync = (options?: ExecSyncOptions) => {
      const exec = (...params: Params): Response => {
        const stdout = preprocess(() => originExcuteSync(command(...params), options)) || ''
        const response = stdout.toString().trim()
        const result = typeof resolv === 'function' ? resolv(response, true) : stdout
        return result
      }

      return { exec }
    }

    /** 同步 */
    const sync = (...params: Params) => optionsSync().exec(...params)
    sync.options = optionsSync

    excute.sync = sync
    return excute
  }
}

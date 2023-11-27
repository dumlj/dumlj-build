import type { TrimPromise } from '../utility-types/trim-promise'
import type { Preprocess } from './createExecutor'

export interface Executor<P extends any[], R> {
  (...params: P): Promise<R>
  sync(...params: P): R
}

export const preprocessExecutor =
  (preprocess: Preprocess) =>
  <P extends any[], R>(inExecute: Executor<P, R>) => {
    type Response = TrimPromise<ReturnType<typeof inExecute>>
    const execute = async (...params: P) => preprocess(() => inExecute(...params)) as Promise<Response>
    execute.sync = (...params: P) => preprocess(() => inExecute.sync(...params)) as Response
    return execute
  }

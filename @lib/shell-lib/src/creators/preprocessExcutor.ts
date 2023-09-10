import type { Preprocess } from './createExcutor'
import type { TrimPromise } from '@/utility-types/trim-promise'

export interface Excutor<P extends any[], R extends any> {
  (...params: P): Promise<R>
  sync(...params: P): R
}

export const preprocessExcutor = (preprocess: Preprocess) => <P extends any[], R>(inExcute: Excutor<P, R>) => {
  type Response = TrimPromise<ReturnType<typeof inExcute>>
  const excute = async (...params: P) => preprocess(() => inExcute(...params)) as Promise<Response>
  excute.sync = (...params: P) => preprocess(() => inExcute.sync(...params)) as Response
  return excute
}

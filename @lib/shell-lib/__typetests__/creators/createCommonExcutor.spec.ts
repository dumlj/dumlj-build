import type { ExecOptions, ExecSyncOptions } from 'child_process'
import { createCommonExcutor } from '@/creators/createCommonExcutor'
import { expectType } from 'tsd-lite'

jest.mock('child_process', () => {
  const COMMAND_RESPONSE_MAP = {
    x: JSON.stringify({ name: 'x' }),
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib/src')>('@dumlj/mock-lib/src')
  return mockExec(COMMAND_RESPONSE_MAP)
})

describe('test creators/createCommonExcutor', () => {
  interface ExcuteSync<P extends any[], R> {
    (...params: P): R
    options(options?: ExecSyncOptions): {
      exec(...params: P): R
    }
  }

  interface Excute<P extends any[], R> {
    (...params: P): Promise<R>
    options(options?: ExecOptions): {
      exec(...params: P): Promise<R>
    }
    sync: ExcuteSync<P, R>
  }

  it('can inherit command parameter inputs.', async () => {
    const fn = (id: string, flag?: boolean) => (flag ? `${id}` : `unknown`)
    expectType<Excute<[string, boolean?], string>>(createCommonExcutor(fn))
  })

  it('can inherit command return outputs.', async () => {
    const fn = () => 'x'
    expectType<Excute<[], number>>(createCommonExcutor(fn, () => 1))
    expectType<Excute<[], boolean>>(createCommonExcutor(fn, () => false))
  })

  it('can return string type when param `resolv` is not provided.', async () => {
    const excute = createCommonExcutor(() => 'x')
    expectType<Promise<string>>(excute())
    expectType<string>(excute.sync())
  })
})

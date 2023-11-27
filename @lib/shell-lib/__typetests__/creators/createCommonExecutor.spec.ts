import type { ExecOptions, ExecSyncOptions } from 'child_process'
import { createCommonExecutor } from '@/creators/createCommonExecutor'
import { expectType } from 'tsd-lite'

jest.mock('child_process', () => {
  const COMMAND_RESPONSE_MAP = {
    x: JSON.stringify({ name: 'x' }),
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib/src')>('@dumlj/mock-lib/src')
  return mockExec(COMMAND_RESPONSE_MAP)
})

describe('test creators/createCommonExecutor', () => {
  interface ExecuteSync<P extends any[], R> {
    (...params: P): R
    options(options?: ExecSyncOptions): {
      exec(...params: P): R
    }
  }

  interface Execute<P extends any[], R> {
    (...params: P): Promise<R>
    options(options?: ExecOptions): {
      exec(...params: P): Promise<R>
    }
    sync: ExecuteSync<P, R>
  }

  it('can inherit command parameter inputs.', async () => {
    const fn = (id: string, flag?: boolean) => (flag ? `${id}` : `unknown`)
    expectType<Execute<[string, boolean?], string>>(createCommonExecutor(fn))
  })

  it('can inherit command return outputs.', async () => {
    const fn = () => 'x'
    expectType<Execute<[], number>>(createCommonExecutor(fn, () => 1))
    expectType<Execute<[], boolean>>(createCommonExecutor(fn, () => false))
  })

  it('can return string type when param `resolv` is not provided.', async () => {
    const execute = createCommonExecutor(() => 'x')
    expectType<Promise<string>>(execute())
    expectType<string>(execute.sync())
  })
})

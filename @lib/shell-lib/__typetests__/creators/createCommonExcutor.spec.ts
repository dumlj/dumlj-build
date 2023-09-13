import { createCommonExcutor } from '@/creators/createCommonExcutor'
import { expectType } from 'tsd-lite'

jest.mock('child_process', () => {
  const COMMAND_RESPONSE_MAP = {
    x: JSON.stringify({ name: 'x' }),
  }

  const { mockExec } = jest.requireActual<typeof import('@dumlj/mock-lib')>('@dumlj/mock-lib/src')
  return mockExec(COMMAND_RESPONSE_MAP)
})

describe('test creators/createCommonExcutor', () => {
  interface Excute<P extends any[], R> {
    (...params: P): Promise<R>
    sync(...params: P): R
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

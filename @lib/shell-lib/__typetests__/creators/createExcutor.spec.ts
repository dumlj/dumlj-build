import { createExcutor } from '@/creators/createExcutor'
import { expectType } from 'tsd-lite'
import { mockExec } from '@dumlj/mock-lib'

const { exec, execSync } = mockExec({
  x: JSON.stringify({ name: 'x' }),
})

jest.mock('child_process', () => {
  return {
    exec,
    execSync,
  }
})

describe('test creators/createExcutor', () => {
  interface Excute<P extends any[], R> {
    (...params: P): Promise<R>
    sync(...params: P): R
  }

  it('can inherit command parameter inputs.', async () => {
    const fn = (id: string, flag?: boolean) => flag ? `${id}` : `unknown`
    const create = createExcutor((excute) => excute())
    expectType<Excute<[string, boolean?], string>>(create(fn))
  })

  it('can inherit command return outputs.', async () => {
    const fn = () => 'x'
    const create = createExcutor((excute) => excute())

    expectType<Excute<[], number>>(create(fn, () => 1))
    expectType<Excute<[], boolean>>(create(fn, () => false))
  })

  it('can return string type when param `resolv` is not provided.', async () => {
    const create = createExcutor((excute) => excute())
    const excute = create(() => 'x')

    expectType<Promise<string>>(excute())
    expectType<string>(excute.sync())
  })
})

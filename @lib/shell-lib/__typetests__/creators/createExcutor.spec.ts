import { createExcutor } from '@/creators/createExcutor'
import { expectType } from 'tsd-lite'

describe('test services/createExcutor', () => {
  it('can inherit params', async () => {
    const fn = (id: string) => `${id}`
    const excute = createExcutor((excute) => excute())(fn)
    expectType<Parameters<typeof excute>>([''] as [string])
  })

  it('can inherit response', async () => {
    const fn = (stdout: string) => stdout
    const excute = createExcutor((excute) => excute())(() => '', fn)
    expectType<ReturnType<typeof excute>>(Promise.resolve<string>(''))
    expectType<ReturnType<typeof excute.sync>>('' as string)
  })
})

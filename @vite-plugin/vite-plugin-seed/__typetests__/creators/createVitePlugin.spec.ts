import type { EachReturnType } from '@/creators/createVitePlugin'
import { expectType } from 'tsd-lite'

describe('test creators/createVitePlugin', () => {
  describe('test EachReturnType', () => {
    it('can get the return value of the function in the object', async () => {
      const funcs = {
        a: (): number => 1,
        b: (): string => '',
        c: (): boolean => true,
        d: (): void => {},
        e: async (): Promise<number> => 1,
        f: (): 1 => 1 as const,
      }

      expectType<EachReturnType<typeof funcs>>({
        a: funcs.a(),
        b: funcs.b(),
        c: funcs.c(),
        d: funcs.d(),
        e: funcs.e(),
        f: funcs.f(),
      })
    })
  })
})

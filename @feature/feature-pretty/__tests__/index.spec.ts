import { clearConsole } from '@/index'

const name = 'CREATE_PRETTY'
const methodNames = ['debug', 'ok', 'info', 'warn', 'fail'] as const
const msg = 'test message'

describe('test pretty', () => {
  const OLD_ENV = process.env
  beforeEach(() => {
    jest.resetModules() // this is important - it clears the cache
    process.env = { ...OLD_ENV }
  })

  afterEach(() => {
    process.env = OLD_ENV
    clearConsole()
  })

  test('test instance include methods', async () => {
    const instance = await import('@/createPretty').then((m) => m.createPretty(name))
    for (const methodName of methodNames) {
      expect(instance).toHaveProperty(methodName)
      const res = instance[methodName](msg)
      expect(res.message).toBe(`${name} ${msg}`)
      const resWithVerbose = instance[methodName](msg, { verbose: true })
      expect(resWithVerbose.message).toEqual(`${name} ${msg}\n${resWithVerbose.prettyMessage}`)
    }
  })

  test('test env', async () => {
    process.env.RUNTIME = 'CLI'
    const instance = await import('@/createPretty').then((m) => m.createPretty(name))
    for (const methodName of methodNames) {
      expect(instance).toHaveProperty(methodName)

      const res = instance[methodName](msg)
      if (methodName === 'debug') {
        expect(res).toBeUndefined()
      } else {
        expect(res.message).toBe(`${name} ${msg}`)
      }
    }
  })

  test('test error object', async () => {
    const instance = await import('@/createPretty').then((m) => m.createPretty(name))
    for (const methodName of methodNames) {
      expect(instance).toHaveProperty(methodName)
      const res = instance[methodName](new Error(msg))
      expect(res.message).toBe(`${name} ${msg}`)
    }
  })
})

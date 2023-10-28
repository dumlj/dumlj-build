import { hello, type HelloOptions } from '@/services/hello'

export { HelloOptions }

export const run = (options?: HelloOptions) => {
  hello(options)
}

export * from '@/services/background'

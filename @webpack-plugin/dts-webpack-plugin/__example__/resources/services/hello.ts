import { MESSAGE } from '@/constants/config'

export interface HelloOptions {
  message: string
}

export const hello = (options?: HelloOptions) => {
  const { message } = options || {}
  // eslint-disable-next-line no-console
  console.log(message || MESSAGE)
}

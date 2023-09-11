import { rest } from 'msw'
import type { Handlers } from '../types'

export const demoHandlers: Handlers = [
  rest.get('https://baidu.com', (req, res, ctx) => {
    return res(ctx.text('baidu.com has been mock'))
  }),
]

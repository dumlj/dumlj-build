// import fs from 'fs-extra'
// import path from 'path'
// import chokidar from 'chokidar'
// import type { IncomingMessage, ServerResponse } from 'http'
// import { SSE_HEADERS } from './constants/sse'

// export interface SetupRemoteProjectMiddlewareOptions {
//   context?: string
// }

// type TransformerCallback = (req: IncomingMessage, res: ServerResponse) => Promise<void> | void
// type Transformer = (callback: TransformerCallback) => (req: IncomingMessage, res: ServerResponse) => Promise<void> | void

// const withCros: Transformer = (callback) => (req, res) => {
//   const { origin } = req.headers || {}
//   origin && res.setHeader('Access-Control-Allow-Origin', origin)
//   callback(req, res)
// }

// const withSse: Transformer = (callback) => (req, res) => {
//   res.writeHead(200, SSE_HEADERS)
//   callback(req, res)
// }

// type Middleware = (...args: any[]) => (transformers: any[]) => (req: IncomingMessage, res: ServerResponse) => void

// const { connect } = fda({ withCros, withSse })

// const createMiddleware = (control: Middleware) => {
//   const connect = (...transformers: Transformer[]) => {
//     return (req: IncomingMessage, res: ServerResponse) => {
//       const fns = [...transformers].reverse()
//       while (fns.length) {
//         const fn = fns.shift()
//         fn((req, res) => {})
//       }
//     }
//   }
// }

// const init = connect(
//   createMiddleware((options?: SetupRemoteProjectMiddlewareOptions) => ({ connect, withCros, withSse }) => {
//     return connect(withSse, withCros)((req: IncomingMessage, res: ServerResponse) => {})
//   })
// )

// export const setupRemoteProjectMiddleware = (options?: SetupRemoteProjectMiddlewareOptions) => {
//   const { context = process.cwd() } = options || {}
//   const watcher = chokidar.watch(context, { ignored: ['**node_modules**'] })
//   watcher.on('all', (type, path) => {})

//   const clients = []
//   return function remoteProjectMiddleware(req: IncomingMessage, res: ServerResponse) {
//     const { origin } = req.headers || {}
//     origin && res.setHeader('Access-Control-Allow-Origin', origin)
//     res.writeHead(200, SSE_HEADERS)
//   }
// }

if (!process.env.npm_execpath.match(/pnpm/)) {
  throw new Error(`\x1b[31mPlease use corepack to install dependencies. @see https://nodejs.cn/api/corepack.html\x1b[0m`)
}

/** 当前 SID */
export const SSE_SESSION_ID = (Date.now() + Math.floor(Math.random() * 1e13)).toString(32)

/** SSE 重载标识 */
export const SSE_RELOAD_TOKEN = 'reload'

/** SSE 服务路径 */
export const SSE_SERVER_PATH = '__livereload__'

/** 头部信息 */
export const SSE_HEADERS = {
  'Content-Type': 'text/event-stream',
  Connection: 'keep-alive',
  'Cache-Control': 'no-cache',
}

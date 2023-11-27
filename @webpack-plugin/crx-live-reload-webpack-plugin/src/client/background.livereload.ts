import { info } from './services/logger'
import sse from './services/sse'
import { onRuntimeMessage } from './utils/sender'
import * as Actions from './constants/action'

// 清除旧日志
// eslint-disable-next-line no-console
console.clear()

// 注册SSE服务
sse()

// 注册心跳服务
// 虽然不需要处理但是也必须注册, 否则调用方会报错
onRuntimeMessage(Actions.HEART_BEAT, () => ({ ok: true }))

// 注册完毕
info('LiveReload in Background is ready.')

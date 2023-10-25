import { broadcastTabs } from '../utils/sender'
import * as Actions from '../constants/action'
import { SSE_RELOAD_TOKEN } from '../../constants/sse'
import type { SseResponse } from '../../types'

/** 重载 */
export const reload = () => {
  if (typeof chrome?.runtime?.reload === 'function') {
    // 广播重载
    broadcastTabs(Actions.LIVERELOAD)

    // 重载
    setTimeout(() => {
      // eslint-disable-next-line no-console
      console.clear()
      chrome.runtime.reload()
    }, 100)
  }
}

let es: EventSource = null

/** 启动 */
export const sse = () => {
  if (!(process.env.LIVERELOAD_SSE_URL && process.env.LIVERELOAD_SSE_SID)) {
    return
  }

  es = new EventSource(`${process.env.LIVERELOAD_SSE_URL}?sid=${process.env.LIVERELOAD_SSE_SID}`)
  es.onmessage = ({ data }) => {
    const response: SseResponse = JSON.parse(data)
    if (response.code === 0 && response.data === SSE_RELOAD_TOKEN) {
      reload()
    }
  }

  es.onerror = () => {
    // 断开重连
    if (es.readyState === 2) {
      setTimeout(sse, 3e3)
    }
  }
}

export default sse

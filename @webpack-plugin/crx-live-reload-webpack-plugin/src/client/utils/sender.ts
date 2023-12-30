import { fail, debug } from '../services/logger'
import { LIVERELOAD_MESSAGE_TARGET } from '../constants/sender'
import 'chrome'

export interface MessageRequestOptions {
  quiet?: boolean
}

export interface MessageRequest<T = any> {
  target: string
  action: string
  payload?: T
  options?: MessageRequestOptions
}

export interface MessageResponse<T = any> {
  code: number
  success: boolean
  message: string
  data?: T
}

export type MessageHandle<T = any> = (payload: T, sender: chrome.runtime.MessageSender) => void

/** 是否为 livereload 信息 */
export const isLiveReloadMessage = <T = any>(request: MessageRequest<T>) => {
  return typeof request === 'object' && request !== null && 'target' in request && 'action' in request && request.target === LIVERELOAD_MESSAGE_TARGET
}

/** 接收信息 */
export const onRuntimeMessage = (() => {
  const handlers: Record<string, MessageHandle> = {}

  /**
   * sendResponse 只是代表该事件是否有效, 所以不能有任何异步情况;
   * 另外 addListener 不能做兜底处理, 如果没有对应的事件处理, ChromeEX 就必须报错处理
   * 出现类似错误: `The message port closed before a response was received.`
   * 若需要异步返回数据给前端, 请使用 `chrome.tabs.sendMessage`
   */
  chrome.runtime.onMessage.addListener((request: MessageRequest, sender, sendResponse) => {
    if (!isLiveReloadMessage(request)) {
      return
    }

    try {
      const { action, payload, options } = request
      const { quiet = false } = options || {}
      quiet !== true && debug(`Message Action: \`${action}\``)

      if (typeof handlers[action] === 'function') {
        const fn = handlers[action]
        const response: MessageResponse = {
          code: 0,
          message: 'ok',
          success: true,
          data: fn(payload, sender),
        }

        quiet !== true && debug(`Message Response: ${JSON.stringify(response, null, 2)}`)
        sendResponse(response)
      }
    } catch (error) {
      fail(error.message)

      const response: MessageResponse = {
        code: 1,
        success: false,
        message: error.message,
      }

      sendResponse(response)
    }
  })

  return <T = any>(action: string, handler: MessageHandle<T>) => {
    if (typeof handler === 'function') {
      handlers[action] = handler
    }
  }
})()

/** 发送信息 */
export function sendRuntimeMessage<T = any, R = any>(action: string, payload?: T, options?: MessageRequestOptions): Promise<R> {
  return new Promise((revolve, reject) => {
    const request: MessageRequest<T> = { target: LIVERELOAD_MESSAGE_TARGET, action, payload, options }
    chrome.runtime.sendMessage(request, (response: MessageResponse<R>) => {
      const { success, code, data, message } = response
      code === 0 && success === true ? revolve(data) : reject(new Error(message))
    })
  })
}

/** 向 Tab 发送信息 */
export function sendTabMessage<T = any, R = any>(tab: number, action: string, payload?: T, options?: MessageRequestOptions): Promise<R> {
  return new Promise((revolve, reject) => {
    const request = { target: LIVERELOAD_MESSAGE_TARGET, action, payload, options }
    chrome.tabs.sendMessage(tab, request, (response: MessageResponse<R>) => {
      const { success, code, data, message } = response
      code === 0 && success === true ? revolve(data) : reject(new Error(message))
    })
  })
}

export interface BroadcastTabsOptions {
  tabs?: number[]
}

/** 广播 Tab 消息 */
export const broadcastTabs = <T = any>(action: string, payload?: T, options?: BroadcastTabsOptions) => {
  return new Promise((resolve) => {
    const { tabs: ids = [] } = options || {}
    chrome.tabs.query({}, (tabs) => {
      const filteredTabs = Array.isArray(ids) && ids.length > 0 ? tabs.filter((tab) => ids.includes(tab.id)) : tabs
      const promises = filteredTabs.map((tab) => sendTabMessage(tab.id, action, payload).catch((error) => error))
      resolve(Promise.all(promises))
    })
  })
}

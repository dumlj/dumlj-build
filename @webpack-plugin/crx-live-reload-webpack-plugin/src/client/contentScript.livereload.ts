import { info } from './services/logger'
import { sendRuntimeMessage, onRuntimeMessage } from './utils/sender'
import * as Actions from './constants/action'

/** 心跳 */
const heartBeat = async (duration = 1e3) => {
  try {
    await sendRuntimeMessage(Actions.HEART_BEAT)
  } catch (error) {
    window.location.reload()
  }

  setTimeout(heartBeat, duration)
}

// 注册心跳
heartBeat()

// 注册重置服务
onRuntimeMessage(Actions.LIVERELOAD, () => window.location.reload())

// 注册完毕
info('LiveReload in Content-Script is ready.')

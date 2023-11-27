import { sendRuntimeMessage, onRuntimeMessage } from '../utils/sender'
import * as Actions from '../constants/action'

/** 是否为 Background */
const isBackground = typeof window === 'undefined'

export interface LogMessage {
  type: 'ok' | 'info' | 'warn' | 'fail' | 'debug'
  message: string
}

const banner = 'LiveReload'
const time = () => {
  const now = new Date()
  return `${now.getHours()}:${now.getMinutes()}:${now.getMinutes()}`
}

const styleTime = (color = '#777777') => `font-weight:bold;color:#fff;background-color:${color};`
const styleBanner = (color: string) => `font-weight:bold;color:#fff;background-color:${color};`
const styleMessage = (color: string) => `font-weight:normal;color:${color};`

const _ok = (message: string, styles = '') => {
  const content = `%c[${time()}]%c[${banner}]%c ${message}`
  // eslint-disable-next-line no-console
  console.log(content, styleTime(), styleBanner('#1cdc9a'), styleMessage('#1cdc9a'), styles)
}

const _info = (message: string, styles = '') => {
  const conten = `%c[${time()}]%c[${banner}]%c ${message}`
  // eslint-disable-next-line no-console
  console.info(conten, styleTime(), styleBanner('#1890ff'), styleMessage('#1890ff'), styles)
}

const _warn = (message: string, styles = '') => {
  const content = `%c[${time()}]%c[${banner}]%c ${message}`
  // eslint-disable-next-line no-console
  console.warn(content, styleTime(), styleBanner('#fdbc4b'), styleMessage('#fdbc4b'), styles)
}

const _fail = (message: string, styles = '') => {
  const content = `%c[${time()}]%c[${banner}]%c ${message}`
  // eslint-disable-next-line no-console
  console.error(content, styleTime(), styleBanner('#c0392b'), styleMessage('#c0392b'), styles)
}

const _debug = (message: string, styles = '') => {
  const content = `%c[${time()}]%c[${banner}]%c ${message}`
  // eslint-disable-next-line no-console
  console.debug(content, styleTime(), styleBanner('#777777'), styleMessage('#777777'), styles)
}

export const ok = (message: string) => {
  if (isBackground) {
    _ok(message)
    return
  }

  _ok(message)
  sendRuntimeMessage(Actions.LOG, { type: 'ok', message })
}

export const info = (message: string) => {
  if (isBackground) {
    _info(message)
    return
  }

  _info(message)
  sendRuntimeMessage(Actions.LOG, { type: 'info', message })
}

export const warn = (message: string) => {
  if (isBackground) {
    _warn(message)
    return
  }

  _warn(message)
  sendRuntimeMessage(Actions.LOG, { type: 'warn', message })
}

export const fail = (message: string) => {
  if (isBackground) {
    _fail(message)
    return
  }

  _fail(message)
  sendRuntimeMessage(Actions.LOG, { type: 'fail', message })
}

export const debug = (message: string) => {
  if (isBackground) {
    _debug(message)
    return
  }

  _debug(message)
  sendRuntimeMessage(Actions.LOG, { type: 'debug', message })
}

if (isBackground) {
  onRuntimeMessage<LogMessage>(Actions.LOG, async (payload, sender) => {
    const from = `By ${sender.url}`
    switch (payload.type) {
      case 'ok': {
        _ok(`${payload.message} %c${from}`, 'color:#999;')
        break
      }
      case 'info': {
        _info(`${payload.message} %c${from}`, 'color:#999;')
        break
      }
      case 'fail': {
        _fail(`${payload.message} %c${from}`, 'color:#999;')
        break
      }
      case 'warn': {
        _warn(`${payload.message} %c${from}`, 'color:#999;')
        break
      }
      case 'debug': {
        _debug(`${payload.message} %c${from}`, 'color:#999;')
        break
      }
    }
  })
}

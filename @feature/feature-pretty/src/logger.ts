import { registerPretty } from './registerPretty'

/** 调试 */
export const debug = registerPretty('cyan', { onlyShowInVerbose: true })

/** 成功 */
export const ok = registerPretty('greenBright', { prefix: '✨' })

/** 信息 */
export const info = registerPretty('cyanBright')

/** 警告 */
export const warn = registerPretty('yellowBright', { prefix: '⚠️' })

/** 错误 */
export const fail = registerPretty('redBright', { prefix: '✗' })

/** 随机颜色 */
export const randomHex = () => `#${((Math.random() * (1 << 24)) | 0).toString(16).toUpperCase().padStart(6, '0')}`

/** 清除窗口信息 */
export const clearConsole = () => process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H')

import { findOutdateds } from '@dumlj/feature-updater'
import chalk from 'chalk'
import { createHelpers, createVitePlugin, createVitePluginEnhancers } from './creators'
import type { PluginContext } from 'rollup'

export const { connect, enhance } = createVitePluginEnhancers({
  helper: () => createHelpers(),
})

/**
 * 是否检测过
 * @description
 * 全局单例，整个想下文只存在一个
 * 有缘提示无缘略过
 */
globalThis.hasChecked = false

/** 名称 */
export const PLUGIN_NAME = 'dumlj-vite-plugin'

/** 基础插件 */
export const vitePlugin = connect(
  createVitePlugin(PLUGIN_NAME, () => ({ helper }) => {
    const { notifications } = helper

    /** 检测版本过期 */
    const checkOutdated = async function (this: PluginContext) {
      if (globalThis.hasChecked === true) {
        return
      }

      globalThis.hasChecked = true

      const outdates = await findOutdateds()
      outdates.forEach(({ name, updateType, version, latestVersion }) => {
        const message = [`${chalk.bold(name)}@${chalk.bold(version)} has a new ${chalk.bold(updateType)} version,`, `please update to ${chalk.bold(latestVersion)}.`]
        this.warn(message.join(''))
      })
    }

    /** 通知 */
    const applyNotify = async function (this: PluginContext) {
      if (Array.isArray(notifications) && notifications.length > 0) {
        notifications.forEach(({ type, message }) => {
          if (typeof this[type] === 'function') {
            // eslint-disable-next-line no-console
            this[type](message)
          }
        })
      }
    }

    return {
      async buildEnd() {
        await Promise.all([checkOutdated.call(this), applyNotify.call(this)])
      },
    }
  })
)

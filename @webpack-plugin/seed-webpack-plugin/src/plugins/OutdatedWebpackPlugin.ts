import { findOutdateds } from '@dumlj/feature-updater'
import chalk from 'chalk'
import type { Compiler } from 'webpack'
import { SeedWebpackPlugin } from './SeedWebpackPlugin'

/**
 * 版本过期通知插件
 * @description
 * 与 SeedWebpackPlugin 相互引用
 * - OutdatedWebpackPlugin 继承 SeedWebpackPlugin
 * - SeedWebpackPlugin 在执行时才会调用 OutdatedWebpackPlugin
 */
export class OutdatedWebpackPlugin extends SeedWebpackPlugin {
  static PLUGIN_NAME = 'outdated-webpack-plugin'

  /** 是否已经检测过 */
  protected hasChecked?: boolean

  /** 版本过期警告 */
  public async yellOutdateds() {
    // 检查过就不在检查
    if (this.hasChecked) {
      return
    }

    // 有缘提示无缘略过
    this.hasChecked = true

    const outdates = await findOutdateds()
    outdates.forEach(({ name, updateType, version, latestVersion }) => {
      const message = [`${chalk.bold(name)}@${chalk.bold(version)} has a new ${chalk.bold(updateType)} version,`, `please update to ${chalk.bold(latestVersion)}.`]
      this.logger.warn(...message)
    })
  }

  public async apply(compiler: Compiler) {
    super.applyNotify(compiler)

    // 结束时提示
    compiler.hooks.afterDone.tap(this.pluginName, () => {
      this.yellOutdateds().catch((error) => {
        this.logger.error(error)
      })
    })
  }
}

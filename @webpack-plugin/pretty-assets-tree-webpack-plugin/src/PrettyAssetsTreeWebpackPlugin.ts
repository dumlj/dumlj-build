import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import type { Compiler } from 'webpack'
import path from 'path'
import chalk from 'chalk'
import micromatch from 'micromatch'
import { mapFilesToOrbitTree, stringifyOrbitTree } from '@dumlj/util-lib'

export interface PrettyAssetsTreeWebpackPluginOptions extends SeedWebpackPluginOptions {
  banner?: string
  /**
   * pattern of filter out included projects
   * @example
   * ['packages/*']
   */
  include?: string | string[]
  /**
   * pattern of filter out excluded projects
   * @example
   * ['__tests__/*']
   */
  exclude?: string | string[]
}

export class PrettyAssetsTreeWebpackPlugin extends SeedWebpackPlugin {
  static PLUGIN_NAME = 'pretty-assets-tree-webpack-plugin'

  protected banner: string
  protected include: string | string[]
  protected exclude: string | string[]

  constructor(options?: PrettyAssetsTreeWebpackPluginOptions) {
    super(options)

    const { banner, include, exclude } = options || {}
    this.banner = banner
    this.include = Array.isArray(include) ? include : typeof include === 'string' ? [include] : []
    this.exclude = Array.isArray(exclude) ? exclude : typeof exclude === 'string' ? [exclude] : []
  }

  protected applyPrint(compiler: Compiler) {
    compiler.hooks.afterDone.tap(this.pluginName, (stats) => {
      if (stats.hasErrors()) {
        return
      }

      const { context, outputPath } = compiler
      const output = path.relative(context, outputPath)

      const messages: string[] = this.banner ? [this.banner] : []
      messages.push('', `┌ ${chalk.white(output)}`)

      const { assets } = stats.toJson()
      const files: string[] = []
      for (const { name } of assets) {
        if (Array.isArray(this.include) && this.include.length > 0) {
          if (micromatch.isMatch(name, this.include)) {
            files.push(name)
          }

          continue
        }

        if (Array.isArray(this.exclude) && this.exclude.length > 0) {
          if (!micromatch.isMatch(name, this.exclude)) {
            files.push(name)
          }

          continue
        }

        files.push(name)
      }

      if (!files.length) {
        this.logger.warn('No files matched, skip...')
        return
      }

      const tree = mapFilesToOrbitTree(files)
      stringifyOrbitTree(tree).forEach(({ orbit, content, isLatest }) => {
        const label = content[content.length - 1]
        const message = [`${orbit} ${chalk.cyan(label)}`]
        isLatest && message.push(chalk.gray(path.join(output, content.join('/'))))
        messages.push(message.join(' '))
      })

      // eslint-disable-next-line no-console
      console.log('\n', messages.join('\n'), '\n')
    })
  }

  public apply(compiler: Compiler) {
    super.apply(compiler)
    this.applyPrint(compiler)
  }
}

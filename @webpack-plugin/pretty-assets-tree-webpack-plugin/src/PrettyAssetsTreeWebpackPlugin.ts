import { SeedWebpackPlugin, type SeedWebpackPluginOptions } from '@dumlj/seed-webpack-plugin'
import type { Compiler } from 'webpack'
import path from 'path'
import chalk from 'chalk'
import micromatch from 'micromatch'
import { travel, convertAssetsToTree, type ExtraNode } from './utils/assetsTree'

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

      const detectLatest = (node: ExtraNode) => {
        const { siblings } = node || {}
        const target = siblings?.[siblings?.length - 1]
        if (!target) {
          return false
        }

        return path.join(target.path, target.name) === path.join(node.path, node.name)
      }

      const { tree, collection } = convertAssetsToTree(files)

      travel(tree)(collection, (node, chain) => {
        const { path: folder, name, isFile } = node
        const isRoot = chain.length === 1
        const isLatest = detectLatest(node)
        const isLastFolder = detectLatest(chain[0])

        const begin = isRoot ? (isLatest && isFile ? '└' : isLastFolder ? '└' : '├') : isLastFolder ? ' ' : '│'
        const orbit = isRoot ? (isFile ? '─' : '┬') : `${isLatest ? '└' : '├'}─${isFile ? '──' : '┬─'}`

        const size = chain.length - 2
        const padLeft = (isRoot ? '─' : ' ') + '│ '.repeat(size > 0 ? size : 0)
        const prefix = `${begin}${padLeft}${orbit}`

        const message = `${prefix} ${isFile ? `${chalk.green(name)} ${chalk.gray(path.join(output, folder, name))}` : chalk.blue(name)}`
        messages.push(message)
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

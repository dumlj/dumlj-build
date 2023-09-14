import fs from 'fs-extra'
import { parseTsconfig } from 'get-tsconfig'
import interpret from 'interpret'
import path from 'path'
import rechoir from 'rechoir'
import { findTsConfig } from './findTsConfig'

export interface RechoirError extends Error {
  failures: RechoirError[]
  error: Error
}

export interface PrepareOptions {
  /** 执行路径 */
  cwd?: string
  /** ts 相关配置 */
  ts?: {
    /** tsconfig.json 名称 */
    configFile?: string
    afterResolveTSConfigFile?(stats: { ts: string; tsconfig: string }): void
  }
}

export const prepare = async <M = any>(file: string, options?: PrepareOptions): Promise<M> => {
  const { cwd = process.cwd(), ts } = options || {}
  const { configFile: tsConfigFile = 'tsconfig.json', afterResolveTSConfigFile } = ts || {}

  const filePath = path.isAbsolute(file) ? file : path.join(cwd, file)
  const extname = path.extname(filePath)

  const interpreted = Object.keys(interpret.jsVariants).find((variant) => variant === extname)
  if (interpreted) {
    switch (interpreted) {
      case '.ts': {
        const tsConfigLike = await findTsConfig(filePath, { cwd })
        const requireFrom = typeof tsConfigLike === 'string' ? path.dirname(tsConfigLike) : cwd
        const tsConfig = path.isAbsolute(tsConfigFile) ? tsConfigFile : path.join(requireFrom, tsConfigFile)

        if (await fs.pathExists(tsConfig)) {
          process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify(parseTsconfig(tsConfig))

          if (typeof afterResolveTSConfigFile === 'function') {
            const ts = path.relative(cwd, file)
            const tsconfig = path.relative(cwd, tsConfig)
            afterResolveTSConfigFile({ ts, tsconfig })
          }
        }

        break
      }
    }

    try {
      rechoir.prepare(interpret.extensions, filePath)
    } catch (error) {
      const messages =
        Array.isArray(error?.failures) && (error as RechoirError).failures.length > 0
          ? (error as RechoirError).failures.map((failure) => failure.error.message).join('\n')
          : (error as Error).message

      throw new Error(`Unable load '${filePath}'\n${messages}\nPlease install one of them`)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(filePath)
}

import fs from 'fs-extra'
import path from 'path'
import { parseTsconfig } from 'get-tsconfig'
import interpret from 'interpret'
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
    onResolved?(stats: { ts: string; tsconfig: string }): void
  }
}

/** 预处理文件 */
export const prepare = async <M = any>(file: string, options?: PrepareOptions): Promise<M> => {
  const { cwd = process.cwd(), ts } = options || {}
  const { configFile: tsConfigFile = 'tsconfig.json', onResolved } = ts || {}

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
          const { compilerOptions } = parseTsconfig(tsConfig)
          process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify(compilerOptions)

          if (typeof onResolved === 'function') {
            const ts = path.relative(cwd, file)
            const tsconfig = path.relative(cwd, tsConfig)
            onResolved({ ts, tsconfig })
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
          : (error as Error)?.message

      throw new Error(`Unable load '${filePath}'\n${messages}\nPlease install one of them`)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(filePath)
}

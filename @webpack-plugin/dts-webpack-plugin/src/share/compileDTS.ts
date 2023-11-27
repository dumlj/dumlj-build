import path from 'path'
import { createCompilerHost, createProgram, type CompilerOptions } from 'typescript'
import { switchCwd } from './switchCwd'

export interface CompileDTSOptions {
  /** 执行目录 */
  cwd?: string
  /** 根目录相对于 tsconfig.json 中的 compilerOptions.rootDir */
  rootDir?: string
}

/** 编译 dts 文件 */
export const compileDTS = (files: string[], compileOptions: CompilerOptions, options?: CompileDTSOptions) => {
  const { rootDir, cwd = process.cwd() } = options || {}
  const rootPath = rootDir || compileOptions?.rootDir || cwd
  const finalRootPath = path.isAbsolute(rootPath) ? rootPath : path.join(cwd, rootPath)
  const createdFiles = {}

  /**
   * 因为 typescript plugin 会使用到 process.cwd()
   * 因此这里需要切换运行环境到当前 webpack 上下文才能保证
   * 插件正常运行，否则无法执行插件
   */
  switchCwd(cwd, () => {
    const host = createCompilerHost(compileOptions)
    host.writeFile = (filename: string, contents: string) => {
      const key = path.relative(finalRootPath, filename)
      createdFiles[key] = contents
    }

    const program = createProgram(files, compileOptions, host)
    program.emit()
  })

  return files.reduce((result, filename) => {
    const key = path.relative(finalRootPath, filename)
    const dts = key.replace(path.extname(filename), '.d.ts')
    result[dts] = createdFiles[dts]
    return result
  }, {})
}

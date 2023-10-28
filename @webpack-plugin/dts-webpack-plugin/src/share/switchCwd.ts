/** 切换执行路径 */
export const switchCwd = (cwd: string, callback: (...args: any[]) => any) => {
  const origin = process.cwd()
  if (cwd === origin) {
    return callback()
  }

  process.chdir(cwd)
  const result = callback()
  process.chdir(origin)
  return result
}

import { parse } from 'dotenv'
import fs from 'fs-extra'
import path from 'path'

/**
 * 解析环境变量文件
 * @param file 环境变量文件
 */
export const parseDotEnvFile = async (file: string) => {
  const content = (await fs.readFile(file)).toString('utf-8')
  const parsed = parse(content)
  const variables = Object.keys(parsed)
  return { content, variables }
}

/**
 * 查找缺失的环境变量
 * @param files 环境变量文件
 */
export const findMissingVariables = async (files: string[]) => {
  const variables: Record<string, string[]> = {}
  const fileMap: Record<string, { content: string }> = {}

  await Promise.all(
    files.map(async (file) => {
      const { content, variables: names } = await parseDotEnvFile(file)
      names.forEach((name) => {
        if (!Array.isArray(variables[name])) {
          variables[name] = []
        }

        variables[name].push(file)
      })

      fileMap[file] = { content }
    })
  )

  const missing = files.map((file) => {
    const names = Object.keys(variables).filter((name) => {
      const env = variables[name]
      return env.indexOf(file) === -1
    })

    return { file, variables: names }
  })

  return { variables, files: fileMap, missing }
}

/**
 * 校验环境文件
 * @param files 环境变量文件
 */
export const validateDotEnv = async (files: string[]) => {
  const cwd = process.cwd()
  if (!(files?.length > 0)) {
    return []
  }

  const invalids: string[] = []
  const { missing, variables, files: fileMap } = await findMissingVariables(files)
  invalids.push(...missing.map(({ file, variables }) => (variables.length > 0 ? `文件 ${path.relative(cwd, file)} 缺少环境变量: ${variables.join(', ')}` : '')).filter(Boolean))

  const missingVariables = Array.from(new Set(Object.values(missing).flatMap(({ variables }) => variables)))
  invalids.push(
    ...missingVariables.map((name) => {
      const files = variables[name].map((file) => {
        const { content } = fileMap[file]
        const line = content.substring(0, content.indexOf(name)).split('\n').length
        return `${path.relative(cwd, file)}:${line}`
      })

      return `环境变量 ${name} 存在于 ${files.join(', ')}`
    })
  )

  return invalids
}

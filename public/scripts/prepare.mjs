import { findWorkspaceProject } from '@dumlj/util-lib'
import fs from 'fs'
import path from 'path'

/** 更新 package */
async function updatePackage(location) {
  const file = path.join(process.cwd(), location, 'package.json')
  const json = await fs.promises.readFile(file, 'utf-8')
  const config = JSON.parse(json)
  config.types = './libs/index.d.ts'
  await fs.promises.writeFile(file, JSON.stringify(config, null, 2))
}

/** 修改 package.json 文件 types 指向 */
async function preparePackage() {
  const projects = await findWorkspaceProject()
  const promises = Array.from(function*() {
    for (const { isPrivate, location } of projects) {
      if (isPrivate) {
        continue
      }
  
      yield updatePackage(location)
    }
  }())

  return Promise.allSettled(promises)
}

preparePackage()

import path from 'path'
import fs from 'fs'

export interface FindWorkspaceRootPathOptions {
  paths?: string[]
}

export async function findWorkspaceRootPath(options?: FindWorkspaceRootPathOptions) {
  const { paths = [...module.paths] } = options || {}
  for (const current of [...paths]) {
    const folder = path.dirname(current)
    const config = path.join(folder, 'package.json')

    if (!fs.existsSync(config)) {
      continue
    }

    const content = await fs.promises.readFile(config, 'utf-8')
    const source = JSON.parse(content)
    if (source.private === true && source.workspaces) {
      return folder
    }
  }
}

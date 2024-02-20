import path from 'path'
import fs from 'fs'

interface FindWorkspaceRootPathOptions {
  paths?: string[]
}

export const findWorkspaceRootPath = async (options?: FindWorkspaceRootPathOptions) => {
  const { paths = [...module.paths] } = options || {}
  const lookup = [...paths]
  do {
    const current = lookup.shift()
    const folder = path.dirname(current)
    const config = path.join(folder, 'package.json')
    if (fs.existsSync(config)) {
      const content = await fs.promises.readFile(config, 'utf-8')
      const source = JSON.parse(content)
      if (source.private === true && source.workspaces) {
        return folder
      }
    }
  } while (lookup.length)
}

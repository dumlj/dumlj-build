import path from 'path'
import fs from 'fs-extra'

export const findWorkspaceRootPath = async () => {
  const lookup = [...module.paths]
  do {
    const current = lookup.shift()
    const folder = path.dirname(current)
    const config = path.join(folder, 'package.json')
    if (await fs.pathExists(config)) {
      const source = await fs.readJson(config)
      if (source.private === true && source.workspaces) {
        return folder
      }
    }
  } while (lookup.length)
}

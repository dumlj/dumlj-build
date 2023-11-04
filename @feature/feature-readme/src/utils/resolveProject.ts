import { startCase } from 'lodash'
import path from 'path'
import fs from 'fs-extra'

export interface ResolveProjectOptions {
  cwd?: string
}

export const resolveProject = async (location: string, options?: ResolveProjectOptions) => {
  const { cwd = process.cwd() } = options || {}
  const pkgJson = path.join(cwd, location, 'package.json')
  const { name, description, repository }: PackageSource = await fs.readJSON(pkgJson, { encoding: 'utf-8' })
  const alias = startCase(name.split('/').pop())
  return { alias, name, description, repository }
}

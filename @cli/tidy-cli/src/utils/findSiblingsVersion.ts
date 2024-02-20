import fs from 'fs-extra'
import path from 'path'
import { execute } from '@dumlj/shell-lib'

export interface FindSiblingsVersionOptions {
  remote?: boolean
}

export const findSiblingsVersion = async (name: string, options?: FindSiblingsVersionOptions) => {
  const { remote = true } = options || {}
  const packageJson = 'package.json'

  try {
    const pkgFile = require.resolve(`${name}/${packageJson}`)
    const { version } = await fs.readJson(pkgFile)
    return version
  } catch (error) {
    // nothings todo...
  }

  try {
    let current = require.resolve(name)
    do {
      const pkgFile = path.join(path.dirname(current), packageJson)
      if (await fs.pathExists(pkgFile)) {
        const source = await fs.readJson(pkgFile)
        if (source.name == name) {
          return source.version
        }
      }

      current = path.dirname(current)
    } while (!['.', '/'].includes(current))
  } catch (error) {
    // nothing todo...
  }

  if (remote) {
    try {
      const version = await execute(`npm view ${name} version`)
      return version
    } catch (error) {
      // nothing todo...
    }
  }

  throw new Error('Version not found.')
}

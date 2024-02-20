import fs from 'fs'
import path from 'path'

export async function readRootPathThroughBin(binPath: string) {
  const existsPackageJson = (folder: string) => {
    const file = path.join(folder, 'package.json')
    return fs.existsSync(file)
  }

  let current: string = path.dirname(binPath)
  while (true) {
    if (['.', '/'].includes(current)) {
      if (existsPackageJson('/')) {
        return current
      }

      return
    }

    if (existsPackageJson(current)) {
      return current
    }

    current = path.dirname(current)
  }
}

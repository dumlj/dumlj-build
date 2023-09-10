import fs from 'fs-extra'
import path from 'path'

let SOURCE_CACHE: PackageSource
export const getPackageSource = async (): Promise<PackageSource> => {
  if (SOURCE_CACHE) {
    return SOURCE_CACHE
  }

  const file = path.join(__dirname, '../package.json')
  SOURCE_CACHE = await fs.readJson(file)
  return SOURCE_CACHE
}

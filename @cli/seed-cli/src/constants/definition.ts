import fs from 'fs-extra'
import path from 'path'

export const { name: PACKAGE_NAME } = fs.readJsonSync(path.join(__dirname, '../../package.json'))

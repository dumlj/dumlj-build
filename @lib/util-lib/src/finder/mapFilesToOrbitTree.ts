import { mapPathsToOrbitTree } from '../orbit'

export const mapFilesToOrbitTree = (files: string[]) => {
  return mapPathsToOrbitTree(files.map((file) => file.split('/')))
}

import Stackblitz, { type EmbedOptions } from '@stackblitz/sdk'
import Zip from 'jszip'

declare const __STACKBLITZ_MANIFEST__: string

export interface MANIFEST_ASSETS_STATS {
  examples: Record<string, string[]>
  tarballs: Record<string, string[]>
  extras?: [string, string][]
}

let MANIFEST_CACHE: MANIFEST_ASSETS_STATS
export const loadManifest = async () => {
  if (MANIFEST_CACHE) {
    return MANIFEST_CACHE
  }

  const response = await fetch(__STACKBLITZ_MANIFEST__)
  const stats: MANIFEST_ASSETS_STATS = await response.json()
  MANIFEST_CACHE = stats
  return stats
}

const TARBALL_CACHE: Record<string, Map<string, string>> = {}
export const loadTarballs = async (example: string) => {
  const { examples } = await loadManifest()
  const deps = examples[example]
  const response = await Promise.all(
    deps.map(async (file) => {
      const response = await fetch(`/${file}.zip`)
      const buffer = await response.arrayBuffer()
      const zip = new Zip()
      const { files } = await zip.loadAsync(buffer, { createFolders: false })

      return Promise.all(
        Object.keys(files).map(async (file) => {
          const zipObject = zip.files[file]
          const content = await zipObject.async('text')
          return [file, content] as [string, string]
        })
      )
    })
  )

  const files = new Map(response.flatMap((file) => file))
  TARBALL_CACHE[example] = files
  return files
}

export const resolveStackblitzProject = async (name: string) => {
  const { extras = [] } = await loadManifest()
  const tarballs = await loadTarballs(name)
  if (!tarballs) {
    throw new Error(`${name} is not found`)
  }

  const extraFiles = new Map(extras)
  const content = extraFiles.get('package.json')
  const { name: title = name, description = '', workspaces = [] } = (content ? JSON.parse(content) : {}) as PackageSource
  const exampleFiles = new Map<string, string>()
  Array.from(tarballs.keys()).forEach((file) => {
    const content = tarballs.get(file)
    if (-1 === file.indexOf('__example__')) {
      exampleFiles.set(file, content)
      return
    }

    const [, path] = file.split('/__example__/')
    if (path === 'package.json') {
      const pkgSource = JSON.parse(content)
      pkgSource.workspaces = workspaces
      exampleFiles.set(path, JSON.stringify(pkgSource, null, 2))
      return
    }

    exampleFiles.set(path, content)
  })

  const files = [].concat(Array.from(extraFiles.entries()), Array.from(exampleFiles.entries())).reduce((result, [name, content]) => {
    result[name] = content
    return result
  }, {})

  return { template: 'node' as const, title, description, files }
}

export const activeProject = (name: string) => async (id: string) => {
  const project = await resolveStackblitzProject(name)
  const options: EmbedOptions = {
    clickToLoad: true,
    showSidebar: true,
    view: 'editor',
    width: '100%',
    height: '100%',
    terminalHeight: 50,
  }

  await Stackblitz.embedProject(id, project, options)
}

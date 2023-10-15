import Stackblitz from '@stackblitz/sdk'

declare const __STACKBLITZ_MANIFEST__: string

export interface MANIFEST_ASSETS_STATS {
  files: Record<string, string>
  projects: Record<string, Record<string, string[]>>
}

let STORE_MANIFEST_ASSETS_STATS: MANIFEST_ASSETS_STATS
export const loadManifest = async () => {
  if (STORE_MANIFEST_ASSETS_STATS) {
    return STORE_MANIFEST_ASSETS_STATS
  }

  const response = await fetch(__STACKBLITZ_MANIFEST__)
  const stats: MANIFEST_ASSETS_STATS = await response.json()
  STORE_MANIFEST_ASSETS_STATS = stats
  return stats
}

const STORE_PROJECTS: Record<string, Record<string, string>> = {}
export const loadProject = async (name: string) => {
  const stats = await loadManifest()
  const { files: extraFiles, projects } = stats
  const { workspaces } = JSON.parse(extraFiles['package.json'])

  if (STORE_PROJECTS[name]) {
    return STORE_PROJECTS[name]
  }

  STORE_PROJECTS[name] = {}

  const files = Object.values(projects[name]).flatMap((name) => name)
  const fileMap = STORE_PROJECTS[name]

  await Promise.all(
    files.map(async (file) => {
      const response = await fetch(`/${file}`)
      const content = await response.text()
      if (-1 === file.indexOf('__example__')) {
        fileMap[file] = content
        return
      }

      const [, path] = file.split('/__example__/')
      if (path === 'package.json') {
        const pkgSource = JSON.parse(content)
        pkgSource.workspaces = workspaces
        fileMap[path] = JSON.stringify(pkgSource, null, 2)
        return
      }

      fileMap[path] = content
    })
  )

  return fileMap
}

export const activeProject = async (name: string) => {
  const { files: extraFiles } = await loadManifest()
  const files = await loadProject(name)
  if (!files) {
    throw new Error(`${name} is not found`)
  }

  const node = document.createElement('div')
  node.id = name
  document.body.append(node)

  const { name: title, description } = JSON.parse(files['package.json'])
  await Stackblitz.embedProject(
    name,
    {
      title,
      description,
      template: 'node',
      files: {
        ...extraFiles,
        ...files,
      },
    },
    {
      clickToLoad: true,
      showSidebar: true,
      view: 'editor',
      width: '100%',
      height: '100%',
      terminalHeight: 50,
    }
  )
}

window['activeProject'] = activeProject

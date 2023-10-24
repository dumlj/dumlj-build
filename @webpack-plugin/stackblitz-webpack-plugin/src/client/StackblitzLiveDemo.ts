import Stackblitz, { type EmbedOptions } from '@stackblitz/sdk'
import Zip from 'jszip'
import { trimEnd, trimStart } from 'lodash'

declare const __STACKBLITZ_MANIFEST__: string
declare const __webpack_public_path__: string | (() => string)

const withPublicPath = (url: string) => {
  const baseUrl = typeof __webpack_public_path__ === 'function' ? __webpack_public_path__() : __webpack_public_path__
  return trimEnd(baseUrl, '/') + '/' + trimStart(url, '/')
}

interface MANIFEST_ASSETS_STATS {
  examples: Record<string, string[]>
  tarballs: Record<string, string[]>
  extras?: [string, string][]
}

export class StackblitzLiveDemo extends HTMLElement {
  protected MANIFEST_CACHE: MANIFEST_ASSETS_STATS
  protected TARBALL_CACHE: Record<string, Map<string, string>>

  constructor() {
    super()
    this.TARBALL_CACHE = {}
  }

  public async connectedCallback() {
    this.style.display = 'block'

    const height = this.getAttribute('height')
    height && (this.style.height = height)

    const name = this.getAttribute('src')
    name && (await this.embed(name))
  }

  public async attributeChangedCallback(name: string, prevValue: string, nextValue: string) {
    if (name === 'name') {
      this.embed(nextValue)
    }
  }

  public disconnectedCallback() {
    this.innerHTML = undefined
  }

  protected async loadManifest() {
    if (this.MANIFEST_CACHE) {
      return this.MANIFEST_CACHE
    }

    const response = await fetch(withPublicPath(__STACKBLITZ_MANIFEST__))
    const stats: MANIFEST_ASSETS_STATS = await response.json()
    this.MANIFEST_CACHE = stats
    return stats
  }

  protected async downloadTarball(project: string) {
    const response = await fetch(withPublicPath(`/${project}.zip`))
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
  }

  protected async loadTarballs(name: string) {
    const { examples } = await this.loadManifest()
    const deps = examples[name]
    if (!(Array.isArray(deps) && deps.length > 0)) {
      return
    }

    const response = await Promise.all(deps.map((name) => this.downloadTarball(name)))
    const files = new Map(response.flatMap((file) => file))

    // example files
    Object.values(await this.downloadTarball(name)).forEach(([path, value]) => {
      files.set(path.split('/__example__/').pop(), value)
    })

    this.TARBALL_CACHE[name] = files
    return files
  }

  protected async resolveStackblitzProject(name: string) {
    const { extras = [] } = await this.loadManifest()
    const tarballs = await this.loadTarballs(name)
    if (!tarballs) {
      throw new Error(`${name} is not found`)
    }

    const PKG_FILE = 'package.json'
    const extraFiles = new Map(extras)
    const content = extraFiles.get(PKG_FILE)
    const { name: title = name, description = '', workspaces = [] } = (content ? JSON.parse(content) : {}) as PackageSource

    // clone tarball files
    const tarballFiles = new Map<string, string>(tarballs.entries())
    if (tarballFiles.has(PKG_FILE)) {
      // example origin source of package.json
      const content = tarballFiles.get(PKG_FILE)
      const pkgSource = JSON.parse(content)

      // merge workspaces
      pkgSource.workspaces = workspaces

      // update package.json
      const merged = JSON.stringify(pkgSource, null, 2)
      tarballFiles.set(PKG_FILE, merged)
    }

    const fileMap = [extraFiles, tarballs, tarballFiles]
    const finalFiles = fileMap.flatMap((group) => Array.from(group.entries()))
    const files = finalFiles.reduce((result, [name, content]) => {
      result[name] = content
      return result
    }, {})

    return { template: 'node' as const, title, description, files }
  }

  protected activeProject(name: string) {
    return async (container: string | HTMLElement, options?: EmbedOptions) => {
      const project = await this.resolveStackblitzProject(name)
      const content = project.files?.['package.json']

      let previewFile = ''
      try {
        const { main } = JSON.parse(content)
        previewFile = typeof main === 'string' ? main : ''
      } catch (error) {
        // nothing todo...
      }

      const vm = await Stackblitz.embedProject(container, project, {
        clickToLoad: true,
        showSidebar: true,
        view: 'editor',
        width: '100%',
        height: '100%',
        terminalHeight: 50,
        ...options,
      })

      if (previewFile) {
        await vm.editor.setCurrentFile(previewFile)
        await vm.editor.openFile(previewFile)
        await vm.editor.setTheme('default')
      }

      return vm
    }
  }

  protected async embed(name: string) {
    this.innerHTML = ''

    const id = `o${(Math.floor(Math.random() * 1e13) + Date.now()).toString(32)}`

    const node = document.createElement('div')
    node.id = id
    this.appendChild(node)

    const style = document.createElement('style')
    style.innerText = `#${id}{border:0;min-height:480px;}`
    this.appendChild(style)

    const launch = this.activeProject(name)
    await launch(id)
  }
}

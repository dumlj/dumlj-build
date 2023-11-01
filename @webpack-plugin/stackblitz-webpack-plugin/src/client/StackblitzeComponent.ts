import Stackblitz, { type VM, type EmbedOptions } from '@stackblitz/sdk'
import Zip from 'jszip'
import { withPublicPath } from './withPublicPath'
import { request } from './request'

declare const __STACKBLITZ_MANIFEST__: string

const WS_DIR = `@dps-${Date.now().toString(36)}`
const PKG_FILE = 'package.json'

export interface MANIFEST_ASSETS_STATS {
  examples: Record<string, string[]>
  tarballs: Record<string, string[]>
  extras?: [string, string][]
}

export class StackblitzeComponent extends HTMLElement {
  protected MANIFEST_CACHE: MANIFEST_ASSETS_STATS
  protected TARBALL_CACHE: Record<string, Map<string, string>>
  protected vm: VM

  constructor() {
    super()
    this.TARBALL_CACHE = {}
  }

  public async connectedCallback() {
    this.style.display = 'block'

    const height = this.getAttribute('height')
    height && (this.style.height = height)

    const name = this.getAttribute('src')
    name && this.embed(name)
  }

  public async attributeChangedCallback(name: string, prevValue: string, nextValue: string) {
    name === 'name' && this.embed(nextValue)
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

  protected async concatUnit8Array(...uint8: Uint8Array[]) {
    const totalSize = uint8.reduce((sum, chunk) => sum + chunk.length, 0)
    const response = new Uint8Array(totalSize)

    let position = 0
    for (const chunk of uint8) {
      response.set(chunk, position)
      position += chunk.length
    }

    return response
  }

  protected async downloadTarball(project: string) {
    const buffer = await request(`/${project}.zip`)
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

  protected async extractTarballs(name: string) {
    const { examples } = await this.loadManifest()
    const deps = examples[name]
    if (!(Array.isArray(deps) && deps.length > 0)) {
      return
    }

    const maps = await Promise.all(
      [name, ...deps].map(async (moduleName) => {
        if (this.TARBALL_CACHE[moduleName]) {
          return this.TARBALL_CACHE[moduleName]
        }

        const map = new Map<string, string>()
        const files = await this.downloadTarball(moduleName)
        files.forEach(([file, content]) => {
          // copy `.stackblitzrc` to outside
          if (name === moduleName && file === '.stackblitzrc') {
            map.set('.stackblitzrc', content)
          }

          const path = `${WS_DIR}/${moduleName}/${file}`
          map.set(path, content)
        })

        this.TARBALL_CACHE[moduleName] = map
        return map
      })
    )

    return new Map(
      (function* () {
        const cloned = [...maps]
        while (cloned.length) {
          yield* cloned.shift()
        }
      })()
    )
  }

  protected async buildProject(name: string) {
    const { examples, extras = [] } = await this.loadManifest()
    const tarballs = await this.extractTarballs(name)
    if (!tarballs) {
      throw new Error(`${name} is not found`)
    }

    const extraFiles = new Map(extras)

    // create a package.json
    const content = extraFiles.get(PKG_FILE)
    const pkgSource = JSON.parse(content)
    const { name: title, version, description, license } = pkgSource
    const workspaces = [name, ...examples[name]].map((name) => `./${WS_DIR}/${name}`)
    const newPkgSource = { name: title, version, description, license, private: true, workspaces }
    tarballs.set(PKG_FILE, JSON.stringify(newPkgSource, null, 2))

    const files: Record<string, string> = {}
    const concats = new Map(
      (function* () {
        yield* extraFiles
        yield* tarballs
      })()
    )

    for (const [path, content] of Array.from(concats.entries())) {
      files[path] = content
    }

    return { template: 'node' as const, title, description, files }
  }

  protected activeProject(name: string) {
    return async (container: string | HTMLElement, options?: EmbedOptions) => {
      const info = await this.buildProject(name)
      const vm = await Stackblitz.embedProject(container, info, {
        clickToLoad: true,
        showSidebar: true,
        view: 'editor',
        width: '100%',
        height: '100%',
        terminalHeight: 50,
        ...options,
      })

      Promise.resolve().finally(async () => {
        const folder = `${WS_DIR}/${name}`
        const source = info.files[`${folder}/${PKG_FILE}`]
        const { main } = JSON.parse(source)
        const previewFile = `${folder}/${main}`
        if (!previewFile) {
          return
        }

        await vm.editor.setCurrentFile(previewFile)
        await vm.editor.openFile(previewFile)
        await vm.editor.setTheme('default')
      })

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
    this.vm = await launch(id)
    return this.vm
  }
}

import { defineWebComponent } from './defineWebComponent'
import Stackblitz, { type VM, type EmbedOptions } from '@stackblitz/sdk'
import Zip from 'jszip'
import { withPublicPath } from './withPublicPath'
import { style, tag } from './htmlInJS'
import { request } from './request'

declare const __STACKBLITZ_HTML_TAG__: string
declare const __STACKBLITZ_MANIFEST__: string

const ID = Date.now().toString(36)
const WS_DIR = `@dps-${ID}`
const BOOTSTRAP_EVENT_TYPE = `bootstrap-${ID}`
const PKG_FILE = 'package.json'
const STACKBLITZ_RC = '.stackblitzrc'

interface MANIFEST_ASSETS_STATS {
  examples: Record<string, string[]>
  tarballs: Record<string, string[]>
  extras?: [string, string][]
  isWorkspace: boolean
}

const bootstrap = defineWebComponent(
  `${__STACKBLITZ_HTML_TAG__}-bootstrap`,
  class StackblitzeComponentBootstrap extends HTMLAnchorElement {
    static readonly inheritTag = 'a'

    public connectedCallback() {
      this.addEventListener('click', () => {
        this.classList.add('loading')
        this.dispatchEvent(
          new CustomEvent(BOOTSTRAP_EVENT_TYPE, {
            bubbles: true,
            cancelable: false,
          })
        )
      })
    }
  }
)

defineWebComponent(
  __STACKBLITZ_HTML_TAG__,
  class StackblitzeComponent extends HTMLElement {
    protected MANIFEST_CACHE: MANIFEST_ASSETS_STATS
    protected TARBALL_CACHE: Record<string, Map<string, string>>
    protected vm: VM
    protected root: ShadowRoot

    constructor() {
      super()

      this.TARBALL_CACHE = {}
    }

    public async connectedCallback() {
      // styles
      this.style.display = 'block'

      const height = this.getAttribute('height')
      height && (this.style.height = height)

      // isolation styles
      this.root = this.attachShadow({ mode: 'open' })

      const handleBootstrap = () => {
        this.root.removeEventListener(BOOTSTRAP_EVENT_TYPE, handleBootstrap)
        const name = this.getAttribute('src')
        name && this.embed(name)
      }

      this.root.addEventListener(BOOTSTRAP_EVENT_TYPE, handleBootstrap)
      this.render()
    }

    public async attributeChangedCallback(name: string, prevValue: string, nextValue: string) {
      name === 'name' && this.embed(nextValue)
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
      const { examples, isWorkspace } = await this.loadManifest()
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
            if (!isWorkspace) {
              map.set(file, content)
              return
            }

            // copy `.stackblitzrc` to outside
            if (name === moduleName && file === STACKBLITZ_RC) {
              map.set(STACKBLITZ_RC, content)
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
      const { examples, extras = [], isWorkspace } = await this.loadManifest()
      const tarballs = await this.extractTarballs(name)
      if (!tarballs) {
        throw new Error(`${name} is not found`)
      }

      const extraFiles = new Map(extras)

      // create a package.json
      const content = extraFiles.get(PKG_FILE)
      const pkgSource = JSON.parse(content)
      const { name: title, version, description, license } = pkgSource

      /**
       * generate a pure package.json only workspace
       * Mainly for trimming dependencies and some redundant properties
       */
      if (isWorkspace) {
        const workspaces = [name, ...examples[name]].map((name) => `./${WS_DIR}/${name}`)
        const newPkgSource = { name: title, version, description, license, private: true, workspaces }
        tarballs.set(PKG_FILE, JSON.stringify(newPkgSource, null, 2))
      }

      // write files
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

    protected async activeProject(name: string, options?: EmbedOptions) {
      const info = await this.buildProject(name)

      // container
      const container = this.root.querySelector('.wrapper')
      const vm = await Stackblitz.embedProject(container as HTMLElement, info, {
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

    protected async embed(name: string) {
      this.vm = await this.activeProject(name)
      return this.vm
    }

    protected render() {
      this.root.innerHTML = `
      ${style`${{
        '.flex': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        '.container': {
          position: 'relative',
          width: '100%',
          height: '100%',
          fontSize: '0.6vw',
          backgroundImage: `
              linear-gradient(
                45deg, rgba(200,200,200,.1) 25%,
                transparent 25%,
                transparent 50%,
                rgba(200,200,200,.1) 50%,
                rgba(200,200,200,.1) 75%,
                transparent 75%,
                transparent
              )
            `,
          backgroundSize: '15em 15em',
        },
        '.bootstrap,.wrapper': {
          position: 'absolute',
          backgroundImage: 'none',
        },
        '.wrapper': {
          pointerEvents: 'none',
        },
        '.button': {
          position: 'relative',
          display: 'inline-flex',
          border: '0.3em solid #000',
          borderRadius: '1.2em',
          padding: '1.8em 4.2em',
          cursor: 'pointer',
        },
        '.button.loading:after': {
          content: '"LOADING"',
          cursor: 'not-allowed',
        },
        '.button:before,.button:after': {
          content: '""',
          position: 'absolute',
          display: 'inline-flex',
          border: '0.25em solid #000',
          borderRadius: '1em',
          width: '100%',
          height: '100%',
        },
        '.button:before': {
          top: '0.1em',
          left: '0.1em',
          backgroundColor: '#000',
        },
        '.button:after': {
          content: '"BOOTSTRAP"',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '1.4em',
          fontWeight: 'bolder',
          backgroundColor: '#fff',
        },
        'iframe.wrapper': {
          pointerEvents: 'auto',
          border: '0',
          minHeight: '480px',
        },
      }}`}
      ${tag`div ${{ class: 'flex container root' }} ${`
          ${tag`div ${{ class: 'flex container bootstrap' }} ${bootstrap`${{ class: 'flex button' }} ${'BOOTSTRAP'}`}`}
          ${tag`div ${{ class: 'flex container wrapper' }}`}
        `}`}
    `
    }
  }
)

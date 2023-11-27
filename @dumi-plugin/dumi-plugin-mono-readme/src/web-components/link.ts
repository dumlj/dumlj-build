declare let __webpack_public_path__: string

interface Project {
  name: string
  location: string
}

const TAG_NAME = 'dumlj-link'
if (!customElements.get(TAG_NAME)) {
  customElements.define(
    TAG_NAME,
    class extends HTMLAnchorElement {
      connectedCallback() {
        const { project } = this.dataset
        const { location }: Project = JSON.parse(decodeURIComponent(project))
        this.setAttribute('href', `${__webpack_public_path__.replace(/\/$/, '')}/${location.replace(/^\//, '').replace('@', '')}`)
      }
    },
    { extends: 'a' }
  )
}

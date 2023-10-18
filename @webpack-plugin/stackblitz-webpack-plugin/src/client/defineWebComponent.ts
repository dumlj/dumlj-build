import type { Class } from 'utility-types'

export const defineWebComponent = (tag: string, Component: Class<HTMLElement>) => {
  if (customElements.get(tag)) {
    throw new Error(`${tag} is exists`)
  }

  customElements.define(tag, Component)
}

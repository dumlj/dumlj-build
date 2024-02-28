import type { Class } from 'utility-types'

function createElement([tag, attachTag]: [string, string?], props: Record<string, any>, children = '') {
  const inlineProps = Object.entries(props).map(([name, value]) => `${name}="${value}"`)
  return attachTag ? `<${attachTag} is="${tag}" ${inlineProps}>${children}</${attachTag}>` : `<${tag} ${props}>${children}</${tag}>`
}

export function defineWebComponent(tag: string, Component: Class<HTMLElement> & { readonly inheritTag?: string }) {
  if (customElements.get(tag)) {
    throw new Error(`${tag} is exists`)
  }

  const inheritTag = typeof Component?.inheritTag === 'string' ? Component.inheritTag : undefined
  customElements.define(tag, Component, { extends: inheritTag })

  return (_: TemplateStringsArray, ...[props, children]: [Record<string, any>, string]) => {
    return createElement([tag, inheritTag], props, children)
  }
}

import type { Class } from 'utility-types'

declare const __SYNTAX_MODULE_NAME__: string

interface SyntaxModule {
  syntax: string
  component: Class<HTMLElement>
}

function defineWebComponent(tag: string, Component: Class<HTMLElement>) {
  if (customElements.get(tag)) {
    throw new Error(`${tag} is exists`)
  }

  customElements.define(tag, Component)
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const syntax: Record<string, SyntaxModule> = require(__SYNTAX_MODULE_NAME__)
Object.values(syntax).forEach(({ syntax, component }) => defineWebComponent(syntax, component))

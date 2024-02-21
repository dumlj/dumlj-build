export function style(_: TemplateStringsArray, stylesheets: Record<string, Record<string, string | number>>) {
  const content = Object.entries(stylesheets).map(([name, styles]) => {
    const lines = Object.entries(styles).map(([prop, value]) => `${prop.replace(/[A-Z]/g, ($1) => `-${$1.toLowerCase()}`)}:${value.toString()}`)
    return `${name}{${lines.join(';')}}`
  })

  return `<style>${content.join('\n')}</style>`
}

export function tag(tagName: TemplateStringsArray, ...[props, children = '']: [Record<string, string>, (string | number)?]) {
  const inlineProps = Object.entries(props).map(([name, value]) => `${name}="${value.toString().replace(/\n/g, '')}"`)
  return `<${tagName.join('')} ${inlineProps.join(' ')}>${children}</${tagName}>`
}

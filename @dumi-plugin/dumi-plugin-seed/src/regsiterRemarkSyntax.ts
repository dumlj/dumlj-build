import kebabCase from 'lodash/kebabCase'
import { unistUtilVisit, type IApi } from 'dumi'

export interface Position {
  line: number
  column: number
  offset: number
}

export interface Node {
  type: string
  value?: string
  children?: Array<Node>
  lang?: string
  meta?: string
  position?: {
    start: Position
    end: Position
  }
}

export const regsiterRemarkSyntax = (name: string, syntax?: string) => (api: IApi) => {
  syntax = syntax || kebabCase(name)

  const remark = () => (tree: any) => {
    unistUtilVisit.visit(tree, 'paragraph', (node: Node, index: number, parent: Node) => {
      if (!Array.isArray(node?.children)) {
        return unistUtilVisit.SKIP
      }

      const [cSymbol, example] = node?.children || []
      if (cSymbol?.type !== 'text' && cSymbol?.value !== syntax && example?.type !== 'inlineCode') {
        return unistUtilVisit.SKIP
      }

      const { value: content } = example
      parent?.children.splice(index, 1, {
        type: 'html',
        lang: 'html',
        value: `<${syntax} content="${content}" />`,
      })
    })
  }

  api.register({
    key: 'modifyConfig',
    stage: Infinity,
    fn: (config: IApi['config']) => {
      config.extraRemarkPlugins = [remark, ...(config?.extraRemarkPlugins || [])]
      return config
    },
  })

  return syntax
}

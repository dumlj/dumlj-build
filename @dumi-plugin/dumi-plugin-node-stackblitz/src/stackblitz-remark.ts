import { unistUtilVisit } from 'dumi'

interface Position {
  line: number
  column: number
  offset: number
}

interface Node {
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

// const block
export const stackblitzRemark = () => {
  return (tree: any) => {
    unistUtilVisit.visit(tree, 'paragraph', (node: Node, index: number, parent: Node) => {
      if (!Array.isArray(node?.children)) {
        return unistUtilVisit.SKIP
      }

      const [symbol, example] = node.children || []
      if (symbol?.type !== 'text' && symbol?.value !== '$stackblitz' && example?.type !== 'inlineCode') {
        return unistUtilVisit.SKIP
      }

      const { value: name } = example
      parent.children.splice(index, 1, {
        type: 'html',
        lang: 'html',
        value: `<stackblitz-live-demo name="${name}" style="height:480px;" />`,
      })
    })
  }
}

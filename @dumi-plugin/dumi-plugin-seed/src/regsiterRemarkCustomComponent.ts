import kebabCase from 'lodash/kebabCase'
import { unistUtilVisit, type IApi } from 'dumi'
import { parse } from 'node-html-parser'

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

export interface VFile {
  cwd: string
  value: string
  messages: string[]
  history: string[]
  data: {
    embeds: string[]
    frontmatter: Record<string, any>
  }
}

export interface SyntaxRenderContext<A extends Record<string, string> = Record<string, string>> {
  /** 标签 */
  tag: string
  /** 属性 */
  attributes: A
  /** 编译成 AST */
  parseAST?: (content: string) => any
  /**
   * dumi vfile interface
   * @see https://github.com/umijs/dumi/blob/v2.2.13/src/loaders/markdown/transformer/remarkEmbed.ts#L111
   */
  vFile: VFile
}

export type CustomComponentRender<A extends Record<string, string> = Record<string, string>> = (context: SyntaxRenderContext<A>) => string | Record<string, any>

export interface RegsiterRemarkCustomComponentOptions extends Pick<SyntaxRenderContext, 'tag' | 'parseAST'> {
  /** 渲染 */
  render?: CustomComponentRender
}

export const regsiterRemarkCustomComponent = (name: string, options?: RegsiterRemarkCustomComponentOptions) => {
  const { tag = kebabCase(name), render, parseAST } = options || {}
  return (api: IApi) => {
    const remarkCustomComponent = () => (tree: any, vFile: VFile) => {
      unistUtilVisit.visit(tree, 'html', (node: Node, index: number, parent: Node) => {
        const html = parse(node.value)
        const target = html.querySelector(tag)
        if (!target) {
          return unistUtilVisit.SKIP
        }

        const { attributes } = target
        const result = render({ tag, attributes, parseAST, vFile })
        if (typeof result === 'string') {
          parent?.children.splice(index, 1, {
            type: 'html',
            lang: 'html',
            value: result,
          })

          return
        }

        if (typeof result === 'object') {
          const nodes = Array.isArray(result) ? result : Array.isArray(result?.children) ? result.children : []
          nodes.length > 0 && parent?.children.splice(index, 1, ...nodes)
        }
      })
    }

    api.register({
      key: 'modifyConfig',
      stage: Infinity,
      fn: (config: IApi['config']) => {
        config.extraRemarkPlugins = [remarkCustomComponent, ...(config?.extraRemarkPlugins || [])]
        return config
      },
    })

    return tag
  }
}

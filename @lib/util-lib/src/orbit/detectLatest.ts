import { DIVIDER_CHAR } from './constants'
import type { ExtraOrbitNode } from './types'

export const detectLatest = (node: ExtraOrbitNode) => {
  const { siblings } = node || {}
  const target = siblings?.[siblings?.length - 1]
  if (!target) {
    return false
  }

  return target.path.concat(target.value).join(DIVIDER_CHAR) === node.path.concat(node.value).join(DIVIDER_CHAR)
}

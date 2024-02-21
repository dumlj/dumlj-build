import type { VirtualBuilder } from './types'

export const DYNAMIC_FILE_SUFFIX = '.dynamic-client-virtual'

export const VIRTUAL_MODULE_RENDER: VirtualBuilder = (context) => {
  const { stem } = context
  return `
'use client'
import dynamic from 'next/dynamic'
export default dynamic(() => import('./${stem}'), { ssr: true })
`
}

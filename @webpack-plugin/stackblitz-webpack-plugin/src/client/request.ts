import { withPublicPath } from './withPublicPath'

export interface RequestProcess {
  loaded: number
  process: number
  total: number
}

export interface RequestOptions {
  onProcess(process: RequestProcess): void
}

export const request = async (url: string, options?: RequestOptions) => {
  const { onProcess } = options || {}
  const response = await fetch(withPublicPath(url))
  const reader = response.body.getReader()
  const totalLength = parseInt(response.headers.get('Content-Length'))
  const chunks: Uint8Array[] = []

  let loadedSize = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }

    chunks.push(value)

    loadedSize += value.length
    if (typeof onProcess === 'function') {
      const process = loadedSize / totalLength
      onProcess({ loaded: loadedSize, process, total: totalLength })
    }
  }

  const concated = new Uint8Array(totalLength)

  let position = 0
  for (const chunk of chunks) {
    concated.set(chunk, position)
    position += chunk.length
  }

  return concated
}

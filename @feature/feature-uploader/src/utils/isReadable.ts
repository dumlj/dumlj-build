import type { Readable } from 'stream'

export const isReadable = (stream: any): stream is Readable => {
  return (
    stream !== null &&
    typeof stream === 'object' &&
    typeof stream.pipe === 'function' &&
    stream.readable !== false &&
    typeof stream._read === 'function' &&
    typeof stream['_readableState'] === 'object'
  )
}

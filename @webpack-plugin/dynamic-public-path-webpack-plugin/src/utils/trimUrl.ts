export const trimUrlPathStart = (url: string) => url.replace(/^([\/]+)/, '')
export const trimUrlPathEnd = (url: string) => url.replace(/([\/]+)$/, '')
export const trimUrlPath = (url: string) => trimUrlPathEnd(trimUrlPathStart(url))

import path from 'path'

export const htmlify = (name: string) => name.replace(path.extname(name), '') + '.html'

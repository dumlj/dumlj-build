import { parse } from 'node-html-parser'

const registerLoader = (fn: (content: string) => Promise<string>) => {
  return function (this: any, content: string) {
    const cb = this.async()

    fn(content)
      .then((result) => cb(null, result))
      .catch((error) => cb(error))
  }
}

export default registerLoader(async (content) => {
  const root = parse(content)
  const cwd = process.cwd()

  root.getElementsByTagName('Stackblitz').forEach((el) => {
    const src = el.getAttribute('src')
    console.log({ src })
  })

  return root.outerHTML
})

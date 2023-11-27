import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { parse } from 'node-html-parser'
import { makeEnvTagRenderer } from '../utils/makeEnvTagRenderer'

const exists = promisify(fs.exists)
const read = promisify(fs.readFile)
const write = promisify(fs.writeFile)

declare interface __ENVS_SWITCH_CONFIG__ {
  envs: Record<string, Record<string, string>>
  htmls?: string[]
}

declare const __ENVS_SWITCH_CONFIG__: __ENVS_SWITCH_CONFIG__

declare const __ENVS_SWITCH_GUID__: string

/** 注入 script */
const injectScript = (content: string, variables: Record<string, any>) => {
  const root = parse(content)
  const [head] = root.getElementsByTagName('head')
  const tag = root.getElementById(__ENVS_SWITCH_GUID__)
  tag && tag.parentNode.removeChild(tag)

  const renderEnvTag = makeEnvTagRenderer(__ENVS_SWITCH_GUID__)
  const script = renderEnvTag`${JSON.stringify(variables)}`
  head.innerHTML = `<script id="${__ENVS_SWITCH_GUID__}">${script}</script>${head.innerHTML}`
  return root.toString()
}

/** 替换 HTML */
const overrideHtmls = async (file: string, variables: Record<string, any>) => {
  const filePath = path.isAbsolute(file) ? file : path.join(process.cwd(), file)
  if (!(await exists(filePath))) {
    // eslint-disable-next-line no-console
    console.log(`[WARN] File ${filePath} not found.`)
    return
  }

  const html = await read(filePath, 'utf-8')
  const finalHTML = injectScript(html, variables)
  await write(filePath, finalHTML, 'utf-8')
  // eslint-disable-next-line no-console
  console.log(`[OK] Inject ${file} success.`)
}

const switchEnv = async (env: string) => {
  const configs: __ENVS_SWITCH_CONFIG__ = { ...__ENVS_SWITCH_CONFIG__ }
  const variables = configs?.envs?.[env]
  const files = configs?.htmls || []
  if (!(typeof variables === 'object' && variables !== null)) {
    // eslint-disable-next-line no-console
    console.error(`\n[ERROR] Environment variables of ${env} are not found. Only ${Object.keys(configs?.envs)} support.\n`)
    return
  }

  // eslint-disable-next-line no-console
  console.log(`[INFO] Switch env to ${env}`)
  // eslint-disable-next-line no-console
  console.log('==== DOTENV START ====')
  // eslint-disable-next-line no-console
  console.dir(variables, { depth: null, colors: true })
  // eslint-disable-next-line no-console
  console.log('==== DOTENV END ====')
  // eslint-disable-next-line no-console
  console.log(`[INFO] Inject environments into files.`)
  const htmls = [].concat(files).filter((file) => path.extname(file) === '.html')
  htmls.length > 0 && (await Promise.all(htmls.map((html) => overrideHtmls(html, variables))))
  // eslint-disable-next-line no-console
  console.log('[OK] Switch envs completed.')
}

const index = process.argv.indexOf(__filename)
const env = process.argv[index + 1]
env && switchEnv(env)

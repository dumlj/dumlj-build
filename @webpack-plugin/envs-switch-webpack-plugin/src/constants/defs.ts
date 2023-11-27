/** 脚本与配置保存的位置 */
export const DEST_PATH = '/switch-env/'

/** 转换脚本名 */
export const SCRIPT_NAME = 'index.js'

/** 配置文件名 */
export const RC_NAME = '.envrc.json'

/**
 * 在 publicRuntimeConfig 的变量名称
 * @description
 * 主要用于存储环境变量
 * 因为 SSR 并没有 HTML 生成
 * 因此需要使用 next 的 `publicRuntimeConfig` 配置去动态切换环境变量
 * 这里主要针对 `plugins/OneNextEnvSwitchPlugin` 与 `templates/next-v12` 两个文件
 */
export const PROP_NAME_IN_NEXT_PUBLIC_RUNTIME_CONFIG = 'envs@next-env-switch-plugin'

const ANY_QUOTE = `["']`
const PATH_STRING_CONTENT = `[^"'\r\n]+`
const IMPORT_STRING = `(?:${ANY_QUOTE}${PATH_STRING_CONTENT}${ANY_QUOTE})`

export const FUNC_STYLE = `(?:\\b(?:import|require)\\s*\\(\\s*(\\/\\*.*\\*\\/\\s*)?${IMPORT_STRING}\\s*\\))`
export const GLOBAL_STYLE = `(?:\\bimport\\s+${IMPORT_STRING})`
export const FROM_STYLE = `(?:\\bfrom\\s+${IMPORT_STRING})`
export const MODULE_STYLE = `(?:\\bmodule\\s+${IMPORT_STRING})`

const STYLE_SET = [FUNC_STYLE, GLOBAL_STYLE, FROM_STYLE, MODULE_STYLE]

export const IMPORT_REGEX_STRING = `(?:${STYLE_SET.join(`|`)})`

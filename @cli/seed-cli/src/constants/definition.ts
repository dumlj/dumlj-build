import type { DiffValues } from '@dumlj/feature-updater'

export const DUMLJ_CONFIG_FILE_NAME = '.dumljrc.ts'

export const YELL_VERSION_TYPE: DiffValues[] = ['minor', 'patch']

export const COMMAND_DIR = 'libs/commands'

export const CLI_REGEXP = /^@dumlj\/(.+?)-cli$/

export const CLI_PREFIX = '@dumlj'

export const COMMAND_EXTNAMES = ['.mjs', '.js']

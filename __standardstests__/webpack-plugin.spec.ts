/* eslint-disable import/no-extraneous-dependencies */

import path from 'path'
import { upperFirst, camelCase } from 'lodash'
import micromatch from 'micromatch'
import { yarnWorkspaces, type ProjectInWorkspaces } from '@dumlj/shell-lib'
import { SeedWebpackPlugin } from '@dumlj/seed-webpack-plugin'

describe('test webpack plugins standards', () => {
  const FOLDER = '@webpack-plugin'
  const RULES = {
    NAME: '@dumlj/*-webpack-plugin',
    FOLDER: '*-webpack-plugin',
  }

  let projects: Array<ProjectInWorkspaces & { name: string }> = []
  beforeAll(async () => {
    const workspaces = await yarnWorkspaces()
    projects = workspaces.filter(({ name, location }) => {
      if (name === '@dumlj/seed-webpack-plugin') {
        return false
      }

      if (0 === location.indexOf(FOLDER)) {
        if (0 !== location.indexOf(path.join(FOLDER, '__'))) {
          return true
        }
      }

      return false
    })
  })

  it('will be named according to the rules', async () => {
    projects.forEach(({ name, location }) => {
      expect(micromatch.isMatch(name, [RULES.NAME])).toBeTruthy()

      const folder = location.replace(`${FOLDER}/`, '')
      expect(micromatch.isMatch(folder, [RULES.FOLDER])).toBeTruthy()
    })
  })

  it('will have basic plugin functionality', async () => {
    projects.forEach(({ name, location }) => {
      /* eslint-disable-next-line @typescript-eslint/no-var-requires */
      const module = require(path.join(__dirname, '..', location, 'src/index.ts'))
      const alias = name.replace('@dumlj/', '')
      const member = upperFirst(camelCase(alias))
      expect(module).toHaveProperty(member)

      const Plugin = module[member]
      expect(Plugin.PLUGIN_NAME).toBe(alias)
      expect(Plugin.prototype).toBeInstanceOf(SeedWebpackPlugin)
    })
  })
})

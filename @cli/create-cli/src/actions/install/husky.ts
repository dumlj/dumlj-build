import { fail, info, ok, warn } from '@dumlj/feature-pretty'
import { execSync } from 'child_process'
import fs from 'fs-extra'
import path from 'path'

type GitHook = 'pre-commit' | 'prepare-commit-msg' | 'commit-msg' | 'post-commit' | 'post-checkout' | 'pre-rebase'

const inPlatform = (platform: NodeJS.Platform) => platform === process.platform

interface InstallHuskyOptions {
  upgrade?: boolean
  cwd?: string
  /** 兼容模式 */
  compatible?: boolean
  /** 跳过 CI 环境 */
  skipCi?: boolean
}

export const husky = async (options: InstallHuskyOptions = {}) => {
  const git = path.join(process.cwd(), '.git')
  const isGitRepo = fs.pathExistsSync(git) && fs.statSync(git).isDirectory()
  if (!isGitRepo) {
    warn('The project is not a Git repository, skip the Husky installation process')
    return
  }

  const { upgrade = false, cwd = process.cwd(), compatible = true, skipCi = true } = options || {}
  if (skipCi && process.env.CI) {
    warn('CI/CD environment, skip Husky installation process')
    return
  }

  const huskyHooksPath = path.join(cwd, '.husky')
  if (upgrade === false && fs.pathExistsSync(huskyHooksPath)) {
    ok('Husky is already installed, skip the Husky installation process')
    return
  }

  const scripts: Array<string | [GitHook, string]> = [
    inPlatform('win32') ? 'set PATH=\\"%PATH%\\":\\%PATH\\%' : 'export PATH=\\"$PATH\\":\\$PATH',
    ['pre-commit', `yarn lint-staged`],
    ['commit-msg', `yarn commitlint --edit \\$1`],
  ]

  const emptyHookCommands = scripts.reduce<Partial<Record<GitHook, string[]>>>((hooks, item) => {
    if (Array.isArray(item)) {
      const [hook] = item
      if (!Array.isArray(hooks[hook])) {
        hooks[hook] = []
      }
    }

    return hooks
  }, {})

  const hookCommands = scripts.reduce((commands, command) => {
    if (typeof command === 'string') {
      Object.keys(commands).forEach((hook) => {
        commands[hook].push(command)
      })
    } else if (Array.isArray(command)) {
      const [hook, script] = command
      commands[hook].push(script)
    }

    return commands
  }, emptyHookCommands)

  const commands = Object.keys(hookCommands).reduce((commands, hook) => {
    const scripts = hookCommands[hook]
    if (Array.isArray(scripts) && scripts.length > 0) {
      commands.push(`yarn husky set .husky/${hook} "${scripts.join('\n')}"`)
    }

    return commands
  }, [])

  if (commands.length > 0) {
    const scripts = ['yarn husky install'].concat(commands).filter(Boolean).join(' && ')
    execSync(scripts, { stdio: 'inherit', cwd })
  }

  try {
    // 兼容部分 Git GUI 不使用 `git config core.hooksPath` 自定义钩子路径
    if (compatible === true) {
      const hooksPath = path.join(cwd, '.git/hooks')
      const files = fs.readdirSync(huskyHooksPath)
      if (files.length > 0) {
        info(`Compatible with some GUI tools that do not use \`git config core.hooksPath\` as the custom hook path`)
        files.forEach((filename) => {
          const huskyFile = path.join(huskyHooksPath, filename)
          const file = path.join(hooksPath, filename)
          fs.pathExistsSync(file) && fs.removeSync(file)
          fs.copySync(huskyFile, file)
          info(`${path.relative(cwd, huskyFile)} => ${path.relative(cwd, file)}`)
        })
      }
    }
  } catch (error) {
    fs.removeSync(huskyHooksPath)
    fail(error)
    return
  }

  ok(`Husky (Git hook) was installed successfully.`)
}

import { createGitExecutor } from '../creators/createGitExecutor'

const command = () => 'git log --pretty="%an %ae%n%cn %ce"'

/** 克隆项目 */
export const gitContributors = createGitExecutor(command, (content) => {
  const uniqed = Array.from(new Set(content.split('\n')))
  const contributors = uniqed.map((item) => {
    const [prefix, domain] = item.split('@')
    const [user] = prefix.split(' ').reverse()
    const email = `${user}@${domain}`
    const name = item.replace(email, '').trim()
    return { name, email }
  })

  // 筛选出来按日期划分
  const authors = Array.from(new Set(contributors.map(({ name }) => name)))
  return authors
    .sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
    .map((name) => {
      // 这里邮箱为最后使用的邮箱
      const contributor = contributors.find((contributor) => contributor.name === name)
      const email = contributor?.email
      return { name, email }
    })
})

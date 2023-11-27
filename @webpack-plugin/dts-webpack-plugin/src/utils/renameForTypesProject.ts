/** 为声明项目重命名 */
export const renameForTypesProject = (name: string) => {
  if (-1 === name.indexOf('@')) {
    return `@types/${name}`
  }

  const [scope, truthName] = name.split('/')
  return `@types/${scope.replace('@', '')}__${truthName}`
}

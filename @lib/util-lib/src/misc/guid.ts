const ids = new Set<string>()

export const guid = () => {
  const uid = `o${(Date.now() + Math.floor(Math.random() * 1e13)).toString(36)}`.substring(0, 8)
  if (ids.has(uid)) {
    return guid()
  }

  ids.add(uid)
  return uid
}

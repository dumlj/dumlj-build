const ids = new Set<string>()

export const guid = () => {
  const uid = `o${Date.now() + Math.floor(Math.random() * 1e13).toString(36)}`
  if (ids.has(uid)) {
    return guid()
  }

  ids.add(uid)
  return uid
}

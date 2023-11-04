const onlySupportESMImportor = new Function('module', 'return import(module)')

export const importOnlySupportESM = async <R = any>(module: string): Promise<R> => {
  const esm = await onlySupportESMImportor(module)
  return esm?.default || esm
}

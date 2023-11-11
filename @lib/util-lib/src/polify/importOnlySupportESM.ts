const onlySupportESMImportor = new Function('module', 'return import(module)')

export const importOnlySupportESM = <R = any>(module: string): Promise<R> => {
  return onlySupportESMImportor(module)
}

export interface PushScriptToEntriesOptions {
  /** 位于另一个入口文件之后 */
  after?: string
}

export const pushScriptToEntries =
  (scriptPath: string, options?: PushScriptToEntriesOptions) =>
  <T>(entries: T): T => {
    const { after } = options || {}
    Object.keys(entries).forEach((name) => {
      const entry = entries[name]
      if (entry && Array.isArray(entry.import) && -1 === entry.import.indexOf(scriptPath)) {
        if (typeof after === 'string') {
          const index = entry.import.indexOf(after)
          if (index !== -1) {
            entry.import.splice(index + 1, 0, scriptPath)
            return
          }
        }

        entry.import.unshift(scriptPath)
      }
    })

    return entries
  }

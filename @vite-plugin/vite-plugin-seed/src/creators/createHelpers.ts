export const createHelpers = () => {
  const notifications: Array<{ type: 'info' | 'warn' | 'error'; message: string }> = []

  const notify = (type: 'info' | 'warn' | 'error', message: string) => {
    notifications.push({ type, message })
  }

  const isSkip = (title: string, variables: Record<string, string>) => {
    const names = Object.keys(variables)
    const invalids = names.filter((name) => !(typeof variables[name] === 'string' && variables[name].length > 0))
    if (invalids.length > 0) {
      notify('warn', `${title}, miss options:${['', ...invalids].join('\n - ')}`)
      return true
    }

    return false
  }

  return { notifications, notify, isSkip }
}

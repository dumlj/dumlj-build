export const mockLatest = (versions: Record<string, Date>) => {
  return (_: string, fn: (error: Error, stdout: string) => void) => {
    const fetch = () => fn(null, JSON.stringify(versions, null, 2))
    Promise.resolve().then(fetch)

    return {
      kill: jest.fn(),
    }
  }
}

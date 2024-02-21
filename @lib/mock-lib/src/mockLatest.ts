export function mockLatest(versions: Record<string, Date>) {
  return function latest(_: string, fn: (error: Error | null, stdout: string) => void) {
    const fetch = () => fn(null, JSON.stringify(versions, null, 2))
    Promise.resolve().then(fetch)

    return {
      kill: jest.fn(),
    }
  }
}

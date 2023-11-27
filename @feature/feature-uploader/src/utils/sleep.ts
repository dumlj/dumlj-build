export function sleep(milliseconds = 3e3) {
  const delay = Number.isSafeInteger(milliseconds) && milliseconds > 0 ? milliseconds : 3e3
  return new Promise<void>((resolve) => setTimeout(() => resolve(), delay))
}

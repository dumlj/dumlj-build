export const gTime = (time: number) => {
  const d = new Date()
  d.setSeconds(time)
  return d
}

describe('mockServer test', () => {
  test('no mock path', async () => {
    await fetch('https://github.com').then((res) => {
      expect(res.status).toBe(200)
    })
  })
  test('mock path', async () => {
    await fetch('https://baidu.com').then(async (res) => {
      const text = await res.text()
      expect(text).toBe('baidu.com has been mock')
    })
  })
})

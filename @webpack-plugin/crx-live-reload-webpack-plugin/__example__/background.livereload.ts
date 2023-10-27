;(() => {
  const url = `${process.env.LIVERELOAD_SSE_URL}?sid=${process.env.LIVERELOAD_SSE_SID}`
  const code = document.querySelector('pre')
  const es = new EventSource(url)
  es.onmessage = ({ data }) => {
    // eslint-disable-next-line no-console
    console.log('[BACKGROUND]', JSON.parse(data))

    const node = document.createElement('div')
    node.innerHTML = `[BACKGROUND][${new Date().toLocaleTimeString()}] ${data}`
    code.appendChild(node)
  }
})()

const node = document.createElement('div')
node.innerHTML = `process.env.APP_ENV is ${process.env.APP_ENV}`
document.body.appendChild(node)

// eslint-disable-next-line no-console
console.log(process.env.APP_ENV)

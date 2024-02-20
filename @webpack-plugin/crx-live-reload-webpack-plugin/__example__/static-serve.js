/* eslint import/no-extraneous-dependencies: "off" */

const path = require('path')
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express()
const port = 3000

app.use(
  '/__livereload__',
  createProxyMiddleware({
    target: 'http://0.0.0.0:8080',
    secure: true,
    changeOrigin: true,
  })
)

app.use(express.static(path.join(__dirname, 'build')))
// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Example app listening on port ${port}`))

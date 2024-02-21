/* eslint import/no-extraneous-dependencies: "off" */
/** @type {import('@dumlj/next-auto-dynamic').nextDynamicClient} */
const { nextDynamicClient } = require('@dumlj/next-auto-dynamic')
const withDynamicClient = nextDynamicClient({
  src: './snippets',
})

/** @type {import('next').NextConfig} */
const nextConfig = {}
module.exports = withDynamicClient(nextConfig)

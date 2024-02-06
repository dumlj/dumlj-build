// eslint-disable-next-line no-var-requires
const dynamicClient = require('@dumlj/next-plugin-dynamic-client')

/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = dynamicClient(nextConfig)

const dynamicClient = require('@dumlj/next-plugin-dynamic-client')

/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = dynamicClient(nextConfig)

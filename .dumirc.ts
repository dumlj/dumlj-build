/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'dumi'

const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  title: 'Dumlj Build',
  outputPath: 'gh-pages/docs',
  resolve: {
    docDirs: ['@docs'],
  },
  hash: true,
  base: isDev ? '/' : '/dumlj/docs/',
  publicPath: isDev ? '/' : '/dumlj/docs/',
  themeConfig: {
    name: 'Dumlj Build',
    footer: 'Dumlj Build MIT Licensed | Copyright © 2023-present',
    socialLinks: {
      github: 'https://github.com/dumlj/dumlj-build',
    },
  },
  plugins: [require.resolve('@dumlj/dumi-plugin-node-stackblitz')],
})

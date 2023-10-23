/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'dumi'

const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  title: 'Dumlj',
  outputPath: 'gh-pages/docs',
  logo: isDev ? '/' : '/dumlj-build/docs/' + 'images/android-chrome-512x512.png',
  favicons: ['images/favicon.ico', 'images/favicon-32x32.png'].map((path) => (isDev ? '/' : '/dumlj-build/docs/' + path)),
  resolve: {
    docDirs: ['@docs'],
  },
  hash: true,
  base: isDev ? '/' : '/dumlj-build/docs/',
  publicPath: isDev ? '/' : '/dumlj-build/docs/',
  themeConfig: {
    name: 'Dumlj',
    footer: 'Dumlj MIT Licensed | Copyright © 2023-present',
    socialLinks: {
      github: 'https://github.com/dumlj/dumlj-build',
    },
  },
  plugins: [require.resolve('@dumlj/dumi-plugin-node-stackblitz'), require.resolve('@dumlj/dumi-plugin-mono-readme')],
})

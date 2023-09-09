import { defineConfig } from 'dumi'

const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  title: 'Dumlj utils',
  // logo: 'images/android-chrome-192x192.png',
  // favicons: ['images/favicon.ico', 'images/favicon-32x32.png'],
  outputPath: 'gh-pages/docs',
  resolve: {
    docDirs: ['@docs'],
  },
  hash: true,
  base: isDev ? '/' : '/dumlj/docs/',
  publicPath: isDev ? '/' : '/dumlj/docs/',
  themeConfig: {
    name: 'Series One',
    footer: 'Series One MIT Licensed | Copyright © 2023-present',
    socialLinks: {
      github: 'https://github.com/dumlj/dumlj-build',
    },
  },
})

/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'dumi'

const isDev = process.env.NODE_ENV === 'development'
const BASE_URL = isDev ? '/' : '/dumlj-build/docs/'

export default defineConfig({
  title: 'Dumlj',
  outputPath: 'gh-pages/docs',
  logo: BASE_URL + 'images/android-chrome-512x512.png',
  favicons: ['images/favicon.ico', 'images/favicon-32x32.png'].map((path) => BASE_URL + path),
  resolve: {
    docDirs: ['@docs'],
  },
  hash: true,
  base: BASE_URL,
  publicPath: BASE_URL,
  themeConfig: {
    name: 'Dumlj',
    footer: 'Dumlj MIT Licensed | Copyright © 2023-present',
    socialLinks: {
      github: 'https://github.com/dumlj/dumlj-build',
    },
  },
  nodeStackblitz: {
    ignored: [
      '**/__tests__/**',
      '**/__typetests__/**',
      '**/__readme__/**',
      '**/jest.*',
      '**/src/**',
      '**/*.map',
      '**/tsconfig.*',
      '**/.npmignore',
      '**/.DS_Store',
      '**/LICENSE.md',
      '**/README.md',
    ],
  },
  plugins: [require.resolve('@dumlj/dumi-plugin-node-stackblitz'), require.resolve('@dumlj/dumi-plugin-mono-readme')],
})

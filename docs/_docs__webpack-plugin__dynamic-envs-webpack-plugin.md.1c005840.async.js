"use strict";(self.webpackChunkdumlj_build=self.webpackChunkdumlj_build||[]).push([[652],{83418:function(a,s,i){i.r(s);var _=i(15112),c=i(56219),r=i(23084),m=i(23552),d=i(36162),j=i(40475),o=i(24186),t=i(87667),p=i(93236),e=i(62086);function n(){var u=(0,t.eL)(),l=u.texts;return(0,e.jsx)(t.dY,{children:(0,e.jsx)(e.Fragment,{children:(0,e.jsxs)("div",{className:"markdown",children:[(0,e.jsx)("p",{}),(0,e.jsxs)("p",{children:[(0,e.jsx)("a",{href:"https://opensource.org/licenses/MIT",children:(0,e.jsx)("img",{src:"https://img.shields.io/badge/License-MIT-4c1.svg",alt:"License: MIT"})}),l[0].value,(0,e.jsx)("a",{href:"https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/dynamic-envs-webpack-plugin",children:(0,e.jsx)("img",{src:"https://img.shields.io/badge/GITHUB-REPO-0?logo=github",alt:"Github Repo"})}),l[1].value,(0,e.jsx)("a",{href:"https://www.npmjs.com/package/@dumlj/dynamic-envs-webpack-plugin",children:(0,e.jsx)("img",{src:"https://badge.fury.io/js/@dumlj%2Fdynamic-envs-webpack-plugin.svg",alt:"NPM Version"})}),l[2].value,(0,e.jsx)("a",{href:"https://dumlj.github.io/dumlj-build/docs",children:(0,e.jsx)("img",{src:"https://img.shields.io/badge/see-docs-blue?logo=dumi&logoColor=green",alt:"See Docs"})}),l[3].value,(0,e.jsx)("a",{href:"https://codecov.io/gh/dumlj/dumlj-build",children:(0,e.jsx)("img",{src:"https://codecov.io/gh/dumlj/dumlj-build/graph/badge.svg?token=ELV5W1H0C0",alt:"codecov"})}),l[4].value]}),(0,e.jsxs)("h1",{id:"dynamic-envs-webpack-plugin",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#dynamic-envs-webpack-plugin",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"Dynamic Envs Webpack Plugin"]}),(0,e.jsx)("p",{children:l[5].value}),(0,e.jsxs)("h2",{id:"install",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#install",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"INSTALL"]}),(0,e.jsx)(d.Z,{lang:"bash",children:l[6].value}),(0,e.jsxs)("h2",{id:"usage",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#usage",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"USAGE"]}),(0,e.jsx)(d.Z,{lang:"ts",children:l[7].value}),(0,e.jsxs)("h2",{id:"live-demo",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#live-demo",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"LIVE DEMO"]}),(0,e.jsx)("p",{children:(0,e.jsx)("dumlj-stackblitz",{height:"47vw",src:"@dumlj-example/dynamic-envs-webpack-plugin"})}),(0,e.jsxs)("h2",{id:"internal-dependencies",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#internal-dependencies",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"INTERNAL DEPENDENCIES"]}),(0,e.jsxs)("pre",{children:[(0,e.jsx)("b",{children:l[8].value}),l[9].value,(0,e.jsx)("a",{is:"dumlj-link","data-project":"%7B%22name%22:%22@dumlj/inject-entry-script-webpack-plugin%22,%22version%22:%222.5.23%22,%22description%22:%22Append%20or%20prepend%20scripts%20to%20entries.%22,%22isPrivate%22:false,%22location%22:%22@webpack-plugin/inject-entry-script-webpack-plugin%22,%22dependencies%22:%5B%22@dumlj/seed-webpack-plugin%22,%22tslib%22,%22@jest/types%22,%22@types/webpack%22,%22ts-jest%22,%22webpack%22%5D,%22workspaceDependencies%22:%5B%22@dumlj/seed-webpack-plugin%22%5D%7D",href:"https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/inject-entry-script-webpack-plugin",children:l[10].value}),l[11].value,(0,e.jsx)("a",{is:"dumlj-link","data-project":"%7B%22name%22:%22@dumlj/seed-webpack-plugin%22,%22version%22:%222.5.23%22,%22description%22:%22Basic%20webpack%20plugins%22,%22isPrivate%22:false,%22location%22:%22@webpack-plugin/seed-webpack-plugin%22,%22dependencies%22:%5B%22@dumlj/feature-updater%22,%22chalk%22,%22tslib%22,%22utility-types%22,%22@dumlj/mock-lib%22,%22@jest/types%22,%22@types/webpack%22,%22ts-jest%22,%22webpack%22%5D,%22workspaceDependencies%22:%5B%22@dumlj/feature-updater%22,%22@dumlj/mock-lib%22%5D%7D",href:"https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/seed-webpack-plugin",children:l[12].value}),l[13].value,(0,e.jsx)("a",{is:"dumlj-link","data-project":"%7B%22name%22:%22@dumlj/feature-updater%22,%22version%22:%222.5.23%22,%22description%22:%22updater%20for%20packages.%22,%22isPrivate%22:false,%22location%22:%22@feature/feature-updater%22,%22dependencies%22:%5B%22@dumlj/shell-lib%22,%22@dumlj/util-lib%22,%22fs-extra%22,%22semver%22,%22tslib%22,%22@dumlj/mock-lib%22,%22@jest/types%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%22@dumlj/shell-lib%22,%22@dumlj/util-lib%22,%22@dumlj/mock-lib%22%5D%7D",href:"https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-updater",children:l[14].value}),l[15].value,(0,e.jsx)("a",{is:"dumlj-link","data-project":"%7B%22name%22:%22@dumlj/shell-lib%22,%22version%22:%222.5.23%22,%22description%22:%22shell%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/shell-lib%22,%22dependencies%22:%5B%22@jest/types%22,%22chokidar%22,%22command-exists%22,%22lodash%22,%22tslib%22,%22ts-jest%22,%22tsd-lite%22%5D,%22workspaceDependencies%22:%5B%5D%7D",href:"https://github.com/dumlj/dumlj-build/tree/main/@lib/shell-lib",children:l[16].value}),l[17].value,(0,e.jsx)("a",{is:"dumlj-link","data-project":"%7B%22name%22:%22@dumlj/util-lib%22,%22version%22:%222.5.23%22,%22description%22:%22util%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/util-lib%22,%22dependencies%22:%5B%22fs-extra%22,%22glob%22,%22tslib%22,%22@jest/types%22,%22memfs%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D",href:"https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib",children:l[18].value}),l[19].value,(0,e.jsx)("a",{is:"dumlj-link","data-project":"%7B%22name%22:%22@dumlj/mock-lib%22,%22version%22:%222.5.23%22,%22description%22:%22mock%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:true,%22location%22:%22@lib/mock-lib%22,%22dependencies%22:%5B%22memfs%22,%22tslib%22,%22webpack%22,%22@jest/types%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D",href:"https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib",children:l[20].value}),(0,e.jsx)("sup",{children:(0,e.jsx)("small",{children:(0,e.jsx)("i",{children:l[21].value})})}),l[22].value,(0,e.jsx)("a",{is:"dumlj-link","data-project":"%7B%22name%22:%22@dumlj/mock-lib%22,%22version%22:%222.5.23%22,%22description%22:%22mock%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:true,%22location%22:%22@lib/mock-lib%22,%22dependencies%22:%5B%22memfs%22,%22tslib%22,%22webpack%22,%22@jest/types%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D",href:"https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib",children:l[23].value}),(0,e.jsx)("sup",{children:(0,e.jsx)("small",{children:(0,e.jsx)("i",{children:l[24].value})})}),l[25].value,(0,e.jsx)("a",{is:"dumlj-link","data-project":"%7B%22name%22:%22@dumlj/seed-webpack-plugin%22,%22version%22:%222.5.23%22,%22description%22:%22Basic%20webpack%20plugins%22,%22isPrivate%22:false,%22location%22:%22@webpack-plugin/seed-webpack-plugin%22,%22dependencies%22:%5B%22@dumlj/feature-updater%22,%22chalk%22,%22tslib%22,%22utility-types%22,%22@dumlj/mock-lib%22,%22@jest/types%22,%22@types/webpack%22,%22ts-jest%22,%22webpack%22%5D,%22workspaceDependencies%22:%5B%22@dumlj/feature-updater%22,%22@dumlj/mock-lib%22%5D%7D",href:"https://github.com/dumlj/dumlj-build/tree/main/@webpack-plugin/seed-webpack-plugin",children:l[26].value}),l[27].value,(0,e.jsx)("a",{is:"dumlj-link","data-project":"%7B%22name%22:%22@dumlj/feature-updater%22,%22version%22:%222.5.23%22,%22description%22:%22updater%20for%20packages.%22,%22isPrivate%22:false,%22location%22:%22@feature/feature-updater%22,%22dependencies%22:%5B%22@dumlj/shell-lib%22,%22@dumlj/util-lib%22,%22fs-extra%22,%22semver%22,%22tslib%22,%22@dumlj/mock-lib%22,%22@jest/types%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%22@dumlj/shell-lib%22,%22@dumlj/util-lib%22,%22@dumlj/mock-lib%22%5D%7D",href:"https://github.com/dumlj/dumlj-build/tree/main/@feature/feature-updater",children:l[28].value}),l[29].value,(0,e.jsx)("a",{is:"dumlj-link","data-project":"%7B%22name%22:%22@dumlj/shell-lib%22,%22version%22:%222.5.23%22,%22description%22:%22shell%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/shell-lib%22,%22dependencies%22:%5B%22@jest/types%22,%22chokidar%22,%22command-exists%22,%22lodash%22,%22tslib%22,%22ts-jest%22,%22tsd-lite%22%5D,%22workspaceDependencies%22:%5B%5D%7D",href:"https://github.com/dumlj/dumlj-build/tree/main/@lib/shell-lib",children:l[30].value}),l[31].value,(0,e.jsx)("a",{is:"dumlj-link","data-project":"%7B%22name%22:%22@dumlj/util-lib%22,%22version%22:%222.5.23%22,%22description%22:%22util%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/util-lib%22,%22dependencies%22:%5B%22fs-extra%22,%22glob%22,%22tslib%22,%22@jest/types%22,%22memfs%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D",href:"https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib",children:l[32].value}),l[33].value,(0,e.jsx)("a",{is:"dumlj-link","data-project":"%7B%22name%22:%22@dumlj/mock-lib%22,%22version%22:%222.5.23%22,%22description%22:%22mock%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:true,%22location%22:%22@lib/mock-lib%22,%22dependencies%22:%5B%22memfs%22,%22tslib%22,%22webpack%22,%22@jest/types%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D",href:"https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib",children:l[34].value}),(0,e.jsx)("sup",{children:(0,e.jsx)("small",{children:(0,e.jsx)("i",{children:l[35].value})})}),l[36].value,(0,e.jsx)("a",{is:"dumlj-link","data-project":"%7B%22name%22:%22@dumlj/mock-lib%22,%22version%22:%222.5.23%22,%22description%22:%22mock%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:true,%22location%22:%22@lib/mock-lib%22,%22dependencies%22:%5B%22memfs%22,%22tslib%22,%22webpack%22,%22@jest/types%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D",href:"https://github.com/dumlj/dumlj-build/tree/main/@lib/mock-lib",children:l[37].value}),(0,e.jsx)("sup",{children:(0,e.jsx)("small",{children:(0,e.jsx)("i",{children:l[38].value})})}),l[39].value,(0,e.jsx)("a",{is:"dumlj-link","data-project":"%7B%22name%22:%22@dumlj/util-lib%22,%22version%22:%222.5.23%22,%22description%22:%22util%20%E5%B7%A5%E5%85%B7%E5%BA%93%22,%22isPrivate%22:false,%22location%22:%22@lib/util-lib%22,%22dependencies%22:%5B%22fs-extra%22,%22glob%22,%22tslib%22,%22@jest/types%22,%22memfs%22,%22ts-jest%22%5D,%22workspaceDependencies%22:%5B%5D%7D",href:"https://github.com/dumlj/dumlj-build/tree/main/@lib/util-lib",children:l[40].value})]}),(0,e.jsx)("p",{})]})})})}s.default=n}}]);

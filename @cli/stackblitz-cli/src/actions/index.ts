import { activeProject } from '@dumlj/stackblitz-webpack-plugin/client'
;(async () => {
  const example = '@dumlj-example/seed-webpack-plugin'
  const node = document.createElement('div')
  node.id = example
  document.body.append(node)

  const launch = activeProject(example)
  await launch(example)
})()

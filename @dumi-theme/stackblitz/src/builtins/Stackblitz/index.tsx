import sdk from '@stackblitz/sdk'
import React, { useCallback } from 'react'

interface StackblitzProps {
  url: string
}

const Stackblitz: React.FC<StackblitzProps> = (props) => {
  const { url } = props

  const init = useCallback(
    (el) => {
      sdk.embedProject(
        el,
        {
          title: 'Node Starter',
          description: 'A basic Node.js project',
          template: 'node',
          files: {
            'index.js': `console.log('Hello World!'${url});`,
            'package.json': `{
              "name": "my-project",
              "scripts": { "hello": "node index.js", "start": "serve node_modules" },
              "dependencies": { "serve": "^14.0.0" },
              "stackblitz": { "installDependencies": true, "startCommand": "npm start" },
            }`,
          },
        },
        {
          clickToLoad: true,
          openFile: 'index.js',
          terminalHeight: 50,
        }
      )
    },
    [url]
  )

  return <div ref={init}></div>
}

export default Stackblitz

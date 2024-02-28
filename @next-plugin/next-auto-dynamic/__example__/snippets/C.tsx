'use client'

import { useEffect, useState } from 'react'

export default function C() {
  const [moduleId, setModuleId] = useState<string>()
  const [parents, setParents] = useState<string[]>()

  useEffect(() => {
    setModuleId(__webpack_module__.id)
    setParents(__webpack_module__.parents)
  }, [])

  return (
    <section>
      <h2>
        C <span>{moduleId}</span>
      </h2>
      <p>No automatic dynamic import by exclude option of plugin.</p>
      <pre>
        Parents:
        <br />
        {JSON.stringify(parents, null, 2)}
      </pre>
    </section>
  )
}

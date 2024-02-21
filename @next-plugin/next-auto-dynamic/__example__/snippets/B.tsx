'use client'

import { useEffect, useState } from 'react'

export default function B() {
  const [moduleId, setModuleId] = useState<string>()
  const [parents, setParents] = useState<string[]>()

  useEffect(() => {
    setModuleId(__webpack_module__.id)
    setParents(__webpack_module__.parents)
  }, [])

  return (
    <section>
      <h2>
        B <span>{moduleId}</span>
      </h2>
      <p>Import "@/B"</p>
      <pre>
        Parents:
        <br />
        {JSON.stringify(parents, null, 2)}
      </pre>
    </section>
  )
}

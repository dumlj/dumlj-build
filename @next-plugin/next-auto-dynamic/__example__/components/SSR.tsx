import A from '../snippets/A'
import B from '@/snippets/B'

export default async function SSR() {
  return (
    <>
      <A />
      <B />
    </>
  )
}

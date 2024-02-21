import A from '../snippets/A'
import B from '@/snippets/B'
import C from '../snippets/C'

export default async function SSR() {
  return (
    <>
      <A />
      <B />
      <C />
    </>
  )
}

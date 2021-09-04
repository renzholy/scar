import Arweave from 'arweave'
import { useRouter } from 'next/router'
import useSWR from 'swr'

const arweave = Arweave.init({})

export default function Block() {
  const router = useRouter()
  const { hash } = router.query as { hash?: string }
  const { data: block } = useSWR(hash ? ['blocks', 'get', hash] : null, () =>
    arweave.blocks.get(hash!),
  )

  if (!hash) {
    return null
  }
  return (
    <>
      <pre>
        <code>{JSON.stringify(block, null, 2)}</code>
      </pre>
    </>
  )
}

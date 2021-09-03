import { GraphQLClient } from 'graphql-request'
import useSWR from 'swr'
import Arweave from 'arweave'
import { getSdk } from '../generated/graphql'

const arweave = Arweave.init({})
const client = new GraphQLClient('https://arweave.net/graphql')
const sdk = getSdk(client)

export default function Index() {
  const { data: info } = useSWR(['getInfo'], () => arweave.network.getInfo(), {
    refreshInterval: 2000,
  })
  const { data: block } = useSWR(
    info ? ['getBlock', info.current] : null,
    () => arweave.blocks.get(info!.current),
    { revalidateOnFocus: false },
  )
  const { data: blocks } = useSWR(
    info ? ['listBlocks', info.current] : null,
    () => sdk.listBlocks({ after: info!.current }),
    {
      revalidateOnFocus: false,
    },
  )

  return (
    <>
      <pre>
        <code>{JSON.stringify(info, null, 2)}</code>
      </pre>
      <pre>
        <code>{JSON.stringify(block, null, 2)}</code>
      </pre>
      <pre>
        <code>{JSON.stringify(blocks, null, 2)}</code>
      </pre>
    </>
  )
}

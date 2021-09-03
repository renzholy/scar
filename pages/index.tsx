import { GraphQLClient } from 'graphql-request'
import useSWR from 'swr'
import Arweave from 'arweave'
import { getSdk } from '../generated/graphql'

const arweave = Arweave.init({})
const client = new GraphQLClient('https://arweave.net/graphql')
const sdk = getSdk(client)

export default function Index() {
  const { data: blocks } = useSWR(['listBlocks'], () => sdk.listBlocks())
  const blockId = blocks?.blocks.edges[0].node.id
  const { data: block } = useSWR(blockId ? ['getBlock', blockId] : null, () =>
    arweave.blocks.get(blockId!),
  )

  return (
    <>
      <pre>
        <code>{JSON.stringify(block, null, 2)}</code>
      </pre>
      <pre>
        <code>{JSON.stringify(blocks, null, 2)}</code>
      </pre>
    </>
  )
}

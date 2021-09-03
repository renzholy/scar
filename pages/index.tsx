import { GraphQLClient } from 'graphql-request'
import useSWR from 'swr'
import Arweave from 'arweave'
import { useMemo } from 'react'
import { WorldMap } from 'grommet'
import { getSdk } from '../generated/graphql'
import usePeersLocation from '../hooks/use-peers-location'

const arweave = Arweave.init({})
const client = new GraphQLClient('https://arweave.net/graphql')
const sdk = getSdk(client)

export default function Index() {
  const { data: locations } = usePeersLocation()
  const places = useMemo(
    () => locations?.map((place) => ({ location: [place.lat, place.lon], color: 'accent-1' })),
    [locations],
  )
  const { data: info } = useSWR(['getInfo'], () => arweave.network.getInfo(), {
    refreshInterval: 2000,
  })
  const { data: block } = useSWR(
    info ? ['getBlock', info.current] : null,
    () => arweave.blocks.get(info!.current),
    { revalidateOnFocus: false },
  )
  const { data: blocks } = useSWR(['listBlocks'], () => sdk.listBlocks(), {
    revalidateOnFocus: false,
  })

  return (
    <>
      <WorldMap places={places} fill="horizontal" />
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

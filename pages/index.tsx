import { GraphQLClient } from 'graphql-request'
import useSWR from 'swr'
import Arweave from 'arweave'
import { useMemo } from 'react'
import { Box, DataTable, Grid, Heading, Text, WorldMap } from 'grommet'
import { getSdk } from '../generated/graphql'
import usePeersLocation from '../hooks/use-peers-location'
import { formatNumber } from '../utils/formatter'

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
  const { data: blocks } = useSWR(
    ['listBlocks'],
    async () => {
      const {
        blocks: { edges },
      } = await sdk.listBlocks({ first: 10 })
      return Promise.all(edges.map(({ node }) => arweave.blocks.get(node.id)))
    },
    {
      revalidateOnFocus: false,
    },
  )

  return (
    <Box pad="medium" width={{ max: '800px' }} margin="0 auto">
      <Grid
        rows={['1/4', '1/4', '1/4', '1/4']}
        columns={['3/4', '1/4']}
        fill="vertical"
        areas={[
          { name: 'map', start: [0, 0], end: [0, 3] },
          { name: 'peers', start: [1, 0], end: [1, 0] },
          { name: 'blocks', start: [1, 1], end: [1, 1] },
          { name: 'queue', start: [1, 2], end: [1, 2] },
          { name: 'latency', start: [1, 3], end: [1, 3] },
        ]}
      >
        <WorldMap gridArea="map" places={places} alignSelf="center" />
        {info ? (
          <>
            <Box gridArea="peers" align="end">
              <Heading level="3" margin="0">
                Peers
              </Heading>
              <Text>{formatNumber.format(info.peers)}</Text>
            </Box>
            <Box gridArea="blocks" align="end">
              <Heading level="3" margin="0">
                Blocks
              </Heading>
              <Text>{formatNumber.format(info.blocks)}</Text>
            </Box>
            <Box gridArea="queue" align="end">
              <Heading level="3" margin="0">
                Queue
              </Heading>
              <Text>{formatNumber.format(info.queue_length)}</Text>
            </Box>
            <Box gridArea="latency" align="end">
              <Heading level="3" margin="0">
                Latency
              </Heading>
              <Text>{formatNumber.format(info.node_state_latency)}</Text>
            </Box>
          </>
        ) : null}
      </Grid>
      <DataTable
        columns={[
          { property: 'height', render: (block) => `#${block.height}`, header: 'Height' },
          { property: 'block_size', header: 'Block size', align: 'end' },
          { property: 'txs', render: (block) => block.txs.length, header: 'Txs', align: 'end' },
        ]}
        data={blocks}
      />
    </Box>
  )
}

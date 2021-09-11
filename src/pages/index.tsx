import useSWR from 'swr'
import { useContext, useMemo } from 'react'
import { Box, DataTable, Grid, Heading, ResponsiveContext, Text, WorldMap } from 'grommet'
import TimeAgo from 'timeago-react'
import prettyBytes from 'pretty-bytes'
import { useHistory } from 'react-router'
import usePeersLocation from '../hooks/use-peers-location'
import { formatNumber } from '../utils/formatter'
import { arweave } from '../utils/arweave'
import { sdk } from '../utils/graphql'
import TransactionsList from '../components/transactions-list'

export default function IndexPage() {
  const history = useHistory()
  const { data: locations } = usePeersLocation({
    revalidateOnFocus: false,
  })
  const places = useMemo(
    () =>
      locations?.map((place) => ({
        location: [place.latitude, place.longitude],
        color: 'accent-1',
      })),
    [locations],
  )
  const { data: info } = useSWR(['getInfo'], () => arweave.network.getInfo(), {
    refreshInterval: 2000,
  })
  const { data: pendings } = useSWR<string[]>(
    'https://arweave.net/tx/pending',
    (url) => fetch(url).then((response) => response.json()),
    { refreshInterval: 2000 },
  )
  const { data: blocks } = useSWR(
    ['listBlocks'],
    async () => {
      const {
        blocks: { edges },
      } = await sdk.listBlocks({ first: 10 })
      return Promise.all(edges.map(({ node }) => arweave.blocks.get(node.id)))
    },
    { refreshInterval: 2000 },
  )
  const { data: transactions } = useSWR(
    ['listTransactions'],
    async () => {
      const {
        transactions: { edges },
      } = await sdk.listTransactions({ first: 10, blockMin: 1 })
      return edges.map(({ node }) => node)
    },
    { refreshInterval: 2000 },
  )
  const size = useContext(ResponsiveContext)

  return (
    <Box pad="medium" width={{ max: '940px', width: '100%' }} margin="0 auto">
      {size === 'small' ? (
        <WorldMap gridArea="map" places={places} alignSelf="center" height="unset" />
      ) : null}
      <Grid
        rows={size === 'small' ? ['1/2', '1/2'] : ['1/3', '1/3', '1/3']}
        columns={size === 'small' ? ['1/3', '1/3', '1/3'] : ['2/3', '16.66%', '16.66%']}
        gap={size === 'small' ? { row: '10px' } : undefined}
        fill="vertical"
        areas={
          size === 'small'
            ? [
                { name: 'peers', start: [0, 0], end: [0, 0] },
                { name: 'blocks', start: [1, 0], end: [1, 0] },
                { name: 'storage', start: [2, 0], end: [2, 0] },
                { name: 'queue', start: [0, 1], end: [0, 1] },
                { name: 'latency', start: [1, 1], end: [1, 1] },
                { name: 'pendings', start: [2, 1], end: [2, 1] },
              ]
            : [
                { name: 'map', start: [0, 0], end: [0, 2] },
                { name: 'peers', start: [1, 0], end: [1, 0] },
                { name: 'blocks', start: [1, 1], end: [1, 1] },
                { name: 'storage', start: [1, 2], end: [1, 2] },
                { name: 'queue', start: [2, 0], end: [2, 0] },
                { name: 'latency', start: [2, 1], end: [2, 1] },
                { name: 'pendings', start: [2, 2], end: [2, 2] },
              ]
        }
      >
        <WorldMap gridArea="map" places={places} alignSelf="center" height="unset" />
        {info ? (
          <>
            <Box gridArea="peers" align={size === 'small' ? 'center' : 'end'}>
              <Heading level="3" margin="0">
                {formatNumber.format(info.peers)}
              </Heading>
              <Text color="dark-6">Peers</Text>
            </Box>
            <Box gridArea="blocks" align={size === 'small' ? 'center' : 'end'}>
              <Heading level="3" margin="0">
                {formatNumber.format(info.blocks)}
              </Heading>
              <Text color="dark-6">Blocks</Text>
            </Box>
            <Box gridArea="storage" align={size === 'small' ? 'center' : 'end'}>
              <Heading level="3" margin="0">
                {blocks
                  ? prettyBytes(parseInt(blocks[0].weave_size as unknown as string, 10), {
                      locale: true,
                      binary: true,
                    })
                  : '-'}
              </Heading>
              <Text color="dark-6">Storage</Text>
            </Box>
            <Box gridArea="queue" align={size === 'small' ? 'center' : 'end'}>
              <Heading level="3" margin="0">
                {formatNumber.format(info.queue_length)}
              </Heading>
              <Text color="dark-6">Queue</Text>
            </Box>
            <Box gridArea="latency" align={size === 'small' ? 'center' : 'end'}>
              <Heading level="3" margin="0">
                {formatNumber.format(info.node_state_latency)}
              </Heading>
              <Text color="dark-6">Latency</Text>
            </Box>
            <Box gridArea="pendings" align={size === 'small' ? 'center' : 'end'}>
              <Heading level="3" margin="0">
                {pendings ? formatNumber.format(pendings.length) : '-'}
              </Heading>
              <Text color="dark-6">Pendings</Text>
            </Box>
          </>
        ) : null}
      </Grid>
      <Heading level="3">Latest blocks</Heading>
      <Box height={{ min: '397px' }} overflow={{ vertical: 'auto' }}>
        <DataTable
          primaryKey="indep_hash"
          columns={[
            { property: 'height', render: (block) => `#${block.height}`, header: 'Height' },
            {
              property: 'timestamp',
              render: (block) => <TimeAgo datetime={block.timestamp * 1000} />,
              header: 'Timestamp',
            },
            {
              property: 'block_size',
              render: (block) =>
                prettyBytes(parseInt(block.block_size as unknown as string, 10), {
                  locale: true,
                  binary: true,
                }),
              header: 'Block size',
              align: 'end',
            },
            {
              property: 'txs',
              render: (block) => formatNumber.format(block.txs.length),
              header: 'Txs',
              align: 'end',
            },
          ]}
          data={blocks}
          fill="vertical"
          placeholder={blocks ? undefined : 'Loading...'}
          onClickRow={({ datum: block }) => {
            history.push(`/block/${block.indep_hash}`)
          }}
        />
      </Box>
      <Heading level="3">Latest transactions</Heading>
      <Box height={{ min: '397px' }} overflow={{ vertical: 'auto' }}>
        <TransactionsList value={transactions} relativeTime={true} />
      </Box>
    </Box>
  )
}

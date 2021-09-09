import useSWR from 'swr'
import { useMemo } from 'react'
import { Box, DataTable, Grid, Heading, Text, WorldMap } from 'grommet'
import TimeAgo from 'timeago-react'
import prettyBytes from 'pretty-bytes'
import { useRouter } from 'next/router'
import usePeersLocation from '../hooks/use-peers-location'
import { formatNumber } from '../utils/formatter'
import { arweave } from '../utils/arweave'
import { sdk } from '../utils/graphql'

export default function Index() {
  const router = useRouter()
  const { data: locations } = usePeersLocation({
    refreshInterval: 30 * 1000,
    revalidateOnFocus: false,
  })
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

  return (
    <Box pad="medium" width={{ max: '940px', width: '100%' }} margin="0 auto">
      <Grid
        rows={['1/3', '1/3', '1/3']}
        columns={['2/3', '16.66%', '16.66%']}
        fill="vertical"
        areas={[
          { name: 'map', start: [0, 0], end: [0, 2] },
          { name: 'peers', start: [1, 0], end: [1, 0] },
          { name: 'blocks', start: [1, 1], end: [1, 1] },
          { name: 'queue', start: [2, 0], end: [2, 0] },
          { name: 'latency', start: [2, 1], end: [2, 1] },
          { name: 'storage', start: [1, 2], end: [2, 2] },
        ]}
      >
        <WorldMap gridArea="map" places={places} alignSelf="center" height="unset" />
        {info ? (
          <>
            <Box gridArea="peers" align="end">
              <Heading level="3" margin="0">
                {formatNumber.format(info.peers)}
              </Heading>
              <Text color="dark-6">Peers</Text>
            </Box>
            <Box gridArea="blocks" align="end">
              <Heading level="3" margin="0">
                {formatNumber.format(info.blocks)}
              </Heading>
              <Text color="dark-6">Blocks</Text>
            </Box>
            <Box gridArea="queue" align="end">
              <Heading level="3" margin="0">
                {formatNumber.format(info.queue_length)}
              </Heading>
              <Text color="dark-6">Queue</Text>
            </Box>
            <Box gridArea="latency" align="end">
              <Heading level="3" margin="0">
                {formatNumber.format(info.node_state_latency)}
              </Heading>
              <Text color="dark-6">Latency</Text>
            </Box>
            <Box gridArea="storage" align="end">
              <Heading level="3" margin="0">
                {blocks
                  ? prettyBytes(parseInt(blocks[0].weave_size as unknown as string, 10), {
                      maximumFractionDigits: 4,
                      minimumFractionDigits: 4,
                      locale: true,
                      binary: true,
                    })
                  : '-'}
              </Heading>
              <Text color="dark-6">Storage</Text>
            </Box>
          </>
        ) : null}
      </Grid>
      <Heading level="3">Latest blocks</Heading>
      <Box height="397px">
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
            { property: 'txs', render: (block) => block.txs.length, header: 'Txs', align: 'end' },
          ]}
          data={blocks}
          fill="vertical"
          placeholder={blocks ? undefined : 'Loading...'}
          onClickRow={({ datum: block }) => {
            router.push(`/block/${block.indep_hash}`)
          }}
        />
      </Box>
      <Heading level="3">Latest transactions</Heading>
      <Box height="397px">
        <DataTable
          primaryKey="id"
          columns={[
            {
              property: 'id',
              render: (transaction) => (
                <Text truncate={true}>
                  {transaction.id.substr(0, 8)}...
                  {transaction.id.substr(transaction.id.length - 8, transaction.id.length)}
                </Text>
              ),
              header: 'Hash',
            },
            {
              property: 'data.type',
              header: 'Type',
              render: (transaction) => (
                <Text truncate={true}>
                  {transaction.recipient ? '[transfer]' : transaction.data.type || '-'}
                </Text>
              ),
            },
            {
              property: 'data.size',
              render: (transaction) => (
                <Text truncate={true}>
                  {transaction.recipient
                    ? ''
                    : prettyBytes(parseInt(transaction.data.size, 10), {
                        locale: true,
                        binary: true,
                      })}
                </Text>
              ),
              align: 'end',
              header: 'Size',
            },
            {
              property: 'fee.ar',
              render: (transaction) => (
                <Text truncate={true}>
                  {transaction.recipient
                    ? `${formatNumber.format(parseFloat(transaction.quantity.ar))} AR`
                    : `${formatNumber.format(parseInt(transaction.fee.winston, 10))} w`}
                </Text>
              ),
              align: 'end',
              header: 'Reward',
            },
          ]}
          data={transactions}
          fill="vertical"
          placeholder={transactions ? undefined : 'Loading...'}
          onClickRow={({ datum: transaction }) => {
            router.push(`/tx/${transaction.id}`)
          }}
        />
      </Box>
    </Box>
  )
}

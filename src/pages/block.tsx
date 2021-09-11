import { Box, DataTable, Grid, Heading, Text } from 'grommet'
import prettyBytes from 'pretty-bytes'
import { useHistory, useParams } from 'react-router-dom'
import useSWR from 'swr'
import { arweave } from '../utils/arweave'
import { formatNumber } from '../utils/formatter'
import { sdk } from '../utils/graphql'

export default function BlockPage() {
  const history = useHistory()
  const { hash } = useParams<{ hash?: string }>()
  const { data: block } = useSWR(hash ? ['blocks', 'get', hash] : null, () =>
    arweave.blocks.get(hash!),
  )
  const { data: transactions } = useSWR(
    block ? ['listTransactions', 'ids', ...block.txs] : null,
    async () => {
      const {
        transactions: { edges },
      } = await sdk.listTransactions({ ids: block!.txs })
      return edges.map(({ node }) => node)
    },
    { revalidateOnFocus: false },
  )

  if (!hash) {
    return null
  }
  return (
    <Box pad="medium" width={{ max: '940px', width: '100%' }} margin="0 auto">
      <Heading level="3" margin={{ top: '0px' }}>
        Block
      </Heading>
      <Text>{block?.indep_hash || '-'}</Text>
      <Grid
        rows={['100%']}
        columns={['1/3', '1/3', '1/3']}
        fill="vertical"
        areas={[
          { name: 'height', start: [0, 0], end: [0, 0] },
          { name: 'timestamp', start: [1, 0], end: [1, 0] },
          { name: 'size', start: [2, 0], end: [2, 0] },
        ]}
      >
        <Box gridArea="height">
          <Heading level="3">Height</Heading>
          <Text>#{block?.height}</Text>
        </Box>
        <Box gridArea="timestamp">
          <Heading level="3">Timestamp</Heading>
          <Text>{block ? new Date(block.timestamp * 1000).toLocaleString() : '-'}</Text>
        </Box>
        <Box gridArea="size">
          <Heading level="3">Size</Heading>
          <Text>
            {block
              ? prettyBytes(parseInt(block.block_size as unknown as string, 10), {
                  locale: true,
                  binary: true,
                })
              : '-'}
          </Text>
        </Box>
      </Grid>
      <Heading level="3">Transactions</Heading>
      <Box height={transactions && transactions.length ? undefined : '73px'}>
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
          placeholder={
            transactions ? (transactions.length ? undefined : 'No transactions') : 'Loading...'
          }
          onClickRow={({ datum: transaction }) => {
            history.push(`/tx/${transaction.id}`)
          }}
        />
      </Box>
    </Box>
  )
}

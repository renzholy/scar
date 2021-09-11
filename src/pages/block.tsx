import { Box, Grid, Heading, Text } from 'grommet'
import chunk from 'lodash/chunk'
import prettyBytes from 'pretty-bytes'
import { useParams } from 'react-router-dom'
import useSWR from 'swr'
import AnchorLink from '../components/anchor-link'
import TransactionsList from '../components/transactions-list'
import { arweave } from '../utils/arweave'
import { formatTime } from '../utils/formatter'
import { sdk } from '../utils/graphql'

export default function BlockPage() {
  const { hash } = useParams<{ hash?: string }>()
  const { data: block } = useSWR(hash ? ['blocks', 'get', hash] : null, () =>
    arweave.blocks.get(hash!),
  )
  const { data: transactions } = useSWR(
    block ? ['listTransactions', 'ids', ...block.txs] : null,
    async () => {
      const nodes = (
        await Promise.all(
          chunk(block!.txs, 100).map(async (ids) => {
            const {
              transactions: { edges },
            } = await sdk.listTransactions({ ids })
            return edges
          }),
        )
      ).flat()
      return nodes.map(({ node }) => node)
    },
    { revalidateOnFocus: false },
  )

  if (!hash) {
    return null
  }
  return (
    <Box pad="medium" width={{ max: '940px', width: '100%' }} margin="0 auto">
      <Heading level="3" color="dark-6" margin={{ top: '0px' }}>
        Block
      </Heading>
      <Text>{block?.indep_hash || '-'}</Text>
      <Heading level="3" color="dark-6">
        Miner
      </Heading>
      <AnchorLink to={`/address/${block?.reward_addr}`} weight="normal" color="light-1">
        {block?.reward_addr || '-'}
      </AnchorLink>
      <Grid
        rows={['100%']}
        columns={['1/3', '1/3', '1/3']}
        fill="vertical"
        areas={[
          { name: 'height', start: [0, 0], end: [0, 0] },
          { name: 'size', start: [1, 0], end: [1, 0] },
          { name: 'timestamp', start: [2, 0], end: [2, 0] },
        ]}
      >
        <Box gridArea="height">
          <Heading level="3" color="dark-6">
            Height
          </Heading>
          <Text>#{block?.height}</Text>
        </Box>
        <Box gridArea="size">
          <Heading level="3" color="dark-6">
            Block size
          </Heading>
          <Text>
            {block
              ? prettyBytes(parseInt(block.block_size as unknown as string, 10), {
                  locale: true,
                  binary: true,
                })
              : '-'}
          </Text>
        </Box>
        <Box gridArea="timestamp">
          <Heading level="3" color="dark-6">
            Timestamp
          </Heading>
          <Text>{block ? formatTime(new Date(block.timestamp * 1000)) : '-'}</Text>
        </Box>
      </Grid>
      <Heading level="3" color="dark-6">
        Transactions&nbsp;
        <Text color="white">({block?.txs?.length || '-'})</Text>
      </Heading>
      <Box
        height={transactions && transactions.length ? undefined : 'small'}
        overflow={{ vertical: 'auto' }}
      >
        <TransactionsList value={transactions} />
      </Box>
    </Box>
  )
}

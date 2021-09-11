import { Anchor, DataTable, Heading, Box, Text, Grid } from 'grommet'
import useSWR from 'swr'
import prettyBytes from 'pretty-bytes'
import Transaction from 'arweave/node/lib/transaction'
import { useMemo } from 'react'
import { useParams } from 'react-router'
import { formatNumber } from '../utils/formatter'
import DataPreview from '../components/data-preview'
import { arweave, Arweave } from '../utils/arweave'
import AnchorLink from '../components/anchor-link'

export default function TransactionPage() {
  const { hash } = useParams<{ hash?: string }>()
  const { data: status } = useSWR(hash ? ['transactions', 'getStatus', hash] : null, () =>
    arweave.transactions.getStatus(hash!),
  )
  const { data: transaction } = useSWR<Transaction>(
    hash ? ['transactions', 'get', hash] : null,
    () => fetch(`https://arweave.net/tx/${hash}`).then((response) => response.json()),
  )
  const type = useMemo(() => {
    const tag = transaction?.tags.find(
      ({ name }) => Arweave.utils.b64UrlToString(name).toLowerCase() === 'content-type',
    )
    return tag ? Arweave.utils.b64UrlToString(tag.value) : undefined
  }, [transaction?.tags])

  if (!hash) {
    return null
  }
  return (
    <Box pad="medium" width={{ max: '940px', width: '100%' }} margin="0 auto">
      <Heading level="3" margin={{ top: '0px' }}>
        Transaction
      </Heading>
      <Text>{transaction?.id || '-'}</Text>
      <Heading level="3">Block</Heading>
      <AnchorLink to={`/block/${status?.confirmed?.block_indep_hash}`}>
        <Anchor weight="normal" color="light-1">
          {status?.confirmed?.block_indep_hash || '-'}
        </Anchor>
      </AnchorLink>
      <Grid
        rows={['100%']}
        columns={['1/3', '1/3', '1/3']}
        fill="vertical"
        areas={[
          { name: 'confirmations', start: [0, 0], end: [0, 0] },
          { name: 'reward', start: [1, 0], end: [1, 0] },
          { name: 'size', start: [2, 0], end: [2, 0] },
        ]}
      >
        <Box gridArea="confirmations">
          <Heading level="3">Confirmations</Heading>
          <Text>
            {status?.confirmed
              ? formatNumber.format(status?.confirmed?.number_of_confirmations)
              : '-'}
          </Text>
        </Box>
        <Box gridArea="reward">
          <Heading level="3">Reward</Heading>
          <Text>
            {transaction ? formatNumber.format(parseInt(transaction.reward, 10)) : '-'} winston
          </Text>
        </Box>
        <Box gridArea="size">
          <Heading level="3">Size</Heading>
          <Text>
            {transaction
              ? prettyBytes(parseInt(transaction.data_size, 10), { locale: true, binary: true })
              : '-'}
          </Text>
        </Box>
      </Grid>
      <Heading level="3">Tags</Heading>
      <Box height={transaction ? undefined : '73px'}>
        <DataTable
          primaryKey="name"
          columns={[
            {
              property: 'name',
              render: (tag) => Arweave.utils.b64UrlToString(tag.name),
              header: 'Name',
            },
            {
              property: 'value',
              render: (tag) => Arweave.utils.b64UrlToString(tag.value),
              header: 'Value',
            },
          ]}
          data={transaction?.tags}
          fill="vertical"
          placeholder={transaction ? undefined : 'Loading...'}
        />
      </Box>
      <Heading level="3">Data</Heading>
      {transaction && parseInt(transaction.data_size, 10) > 0 ? (
        <>
          <Anchor
            href={`https://arweave.net/${transaction.id}`}
            target="_blank"
            weight="normal"
            margin={{ bottom: 'medium' }}
            color="light-1"
          >
            https://arweave.net/{transaction.id}
          </Anchor>
          <DataPreview id={transaction.id} type={type} />
        </>
      ) : (
        <Text>No data</Text>
      )}
    </Box>
  )
}
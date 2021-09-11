import { Anchor, DataTable, Heading, Box, Text, Grid } from 'grommet'
import useSWR from 'swr'
import prettyBytes from 'pretty-bytes'
import Transaction from 'arweave/node/lib/transaction'
import { useMemo } from 'react'
import { useParams } from 'react-router'
import { formatBalance, formatNumber } from '../utils/formatter'
import DataPreview from '../components/data-preview'
import { arweave, Arweave } from '../utils/arweave'
import AnchorLink from '../components/anchor-link'
import DataTablePlaceholder from '../components/data-table-placeholder'

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
  const { data: sender } = useSWR(
    transaction ? ['wallets', 'ownerToAddress', transaction.owner] : null,
    () => arweave.wallets.ownerToAddress(transaction!.owner),
  )
  const { data: miner } = useSWR(
    transaction ? ['wallets', 'ownerToAddress', transaction.signature] : null,
    () => arweave.wallets.ownerToAddress(transaction!.signature),
  )

  if (!hash) {
    return null
  }
  return (
    <Box pad="medium" width={{ max: '940px', width: '100%' }} margin="0 auto">
      <Heading level="3" color="dark-6" margin={{ top: '0px' }}>
        Transaction
      </Heading>
      <Text>{transaction?.id || '-'}</Text>
      <Grid
        rows={['100%']}
        columns={['1/3', '1/3', '1/3']}
        fill="vertical"
        areas={[
          { name: 'size', start: [0, 0], end: [0, 0] },
          { name: 'confirmations', start: [1, 0], end: [1, 0] },
          { name: 'reward', start: [2, 0], end: [2, 0] },
        ]}
      >
        <Box gridArea="size">
          <Heading level="3" color="dark-6">
            {transaction?.target ? 'Amount' : 'Size'}
          </Heading>
          <Text>
            {transaction
              ? transaction.target
                ? `${formatBalance(transaction.quantity, 12)} AR`
                : prettyBytes(parseInt(transaction.data_size, 10), { locale: true, binary: true })
              : '-'}
          </Text>
        </Box>
        <Box gridArea="confirmations">
          <Heading level="3" color="dark-6">
            Confirmations
          </Heading>
          <Text>
            {status?.confirmed
              ? formatNumber.format(status?.confirmed?.number_of_confirmations)
              : '-'}
          </Text>
        </Box>
        <Box gridArea="reward">
          <Heading level="3" color="dark-6">
            Reward
          </Heading>
          <Text>
            {transaction ? formatNumber.format(parseInt(transaction.reward, 10)) : '-'} winston
          </Text>
        </Box>
      </Grid>
      <Heading level="3" color="dark-6">
        Block
      </Heading>
      <AnchorLink
        to={`/block/${status?.confirmed?.block_indep_hash}`}
        weight="normal"
        color="light-1"
      >
        {status?.confirmed?.block_indep_hash || '-'}
      </AnchorLink>
      <Heading level="3" color="dark-6">
        Sender
      </Heading>
      <AnchorLink to={`/address/${sender}`} weight="normal" color="light-1">
        {sender || '-'}
      </AnchorLink>
      <Heading level="3" color="dark-6">
        Miner
      </Heading>
      <AnchorLink to={`/address/${miner}`} weight="normal" color="light-1">
        {miner || '-'}
      </AnchorLink>
      {transaction?.target ? (
        <>
          <Heading level="3" color="dark-6">
            Receiver
          </Heading>
          <AnchorLink to={`/address/${transaction?.target}`} weight="normal" color="light-1">
            {transaction?.target || '-'}
          </AnchorLink>
        </>
      ) : (
        <>
          <Heading level="3" color="dark-6">
            Tags
          </Heading>
          <Box height={transaction ? undefined : 'small'}>
            <DataTable
              primaryKey={false}
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
              placeholder={
                transaction?.tags.length ? undefined : (
                  <DataTablePlaceholder empty={transaction?.tags.length === 0} />
                )
              }
            />
          </Box>
          <Heading level="3" color="dark-6">
            Data
          </Heading>
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
        </>
      )}
    </Box>
  )
}

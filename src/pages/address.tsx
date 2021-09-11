import { Box, Heading, Text } from 'grommet'
import { useParams } from 'react-router-dom'
import useSWR from 'swr'
import TransactionsList from '../components/transactions-list'
import { arweave } from '../utils/arweave'
import { formatBalance } from '../utils/formatter'
import { sdk } from '../utils/graphql'

export default function AddressPage() {
  const { hash } = useParams<{ hash?: string }>()
  const { data: balance } = useSWR(hash ? ['wallets', 'getBalance', hash] : null, () =>
    arweave.wallets.getBalance(hash!),
  )
  const { data: sentTransactions } = useSWR(
    hash ? ['listTransactions', 'owners', hash] : null,
    async () => {
      const {
        transactions: { edges },
      } = await sdk.listTransactions({ owners: [hash!] })
      return edges.map(({ node }) => node)
    },
    { revalidateOnFocus: false },
  )
  const { data: receivedTransactions } = useSWR(
    hash ? ['listTransactions', 'recipients', hash] : null,
    async () => {
      const {
        transactions: { edges },
      } = await sdk.listTransactions({ recipients: [hash!] })
      return edges.map(({ node }) => node)
    },
    { revalidateOnFocus: false },
  )

  return (
    <Box pad="medium" width={{ max: '940px', width: '100%' }} margin="0 auto">
      <Heading level="3" margin={{ top: '0px' }}>
        Address
      </Heading>
      <Text>{hash}</Text>
      <Heading level="3">Balance</Heading>
      <Text>{balance === undefined ? '-' : formatBalance(balance, 12)}&nbsp;AR</Text>
      <Heading level="3">Received transactions</Heading>
      <Box
        height={receivedTransactions && receivedTransactions.length ? undefined : '73px'}
        overflow={{ vertical: 'auto' }}
      >
        <TransactionsList value={receivedTransactions} />
      </Box>
      <Heading level="3">Sent transactions</Heading>
      <Box
        height={sentTransactions && sentTransactions.length ? undefined : '73px'}
        overflow={{ vertical: 'auto' }}
      >
        <TransactionsList value={sentTransactions} />
      </Box>
    </Box>
  )
}

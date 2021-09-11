import { Box, Heading, Text } from 'grommet'
import { useParams } from 'react-router-dom'
import useSWR from 'swr'
import { arweave } from '../utils/arweave'
import { formatBalance } from '../utils/formatter'

export default function AddressPage() {
  const { hash } = useParams<{ hash?: string }>()
  const { data: balance } = useSWR(hash ? ['wallets', 'getBalance', hash] : null, () =>
    arweave.wallets.getBalance(hash!),
  )

  return (
    <Box pad="medium" width={{ max: '940px', width: '100%' }} margin="0 auto">
      <Heading level="3" margin={{ top: '0px' }}>
        Address
      </Heading>
      <Text>{hash}</Text>
      <Heading level="3">Balance</Heading>
      <Text>{balance === undefined ? '-' : formatBalance(balance, 12)}&nbsp;AR</Text>
    </Box>
  )
}

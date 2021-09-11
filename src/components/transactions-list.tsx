import { DataTable, Text } from 'grommet'
import prettyBytes from 'pretty-bytes'
import { useHistory } from 'react-router'
import { ListTransactionsQuery } from '../generated/graphql'
import { formatNumber } from '../utils/formatter'

export default function TransactionsList(props: {
  value?: ListTransactionsQuery['transactions']['edges'][0]['node'][]
}) {
  const { value: transactions } = props
  const history = useHistory()

  return (
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
  )
}

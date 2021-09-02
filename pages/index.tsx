import { GraphQLClient } from 'graphql-request'
import { getSdk } from '../generated/graphql'

const client = new GraphQLClient('https://arweave.net/graphql')

const sdk = getSdk(client)

export default function Index() {
  sdk.getBlocks()
  return null
}

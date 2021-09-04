import { GraphQLClient } from 'graphql-request'
import { getSdk } from '../generated/graphql'

const client = new GraphQLClient('https://arweave.net/graphql')

export const sdk = getSdk(client)

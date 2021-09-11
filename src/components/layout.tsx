import { Anchor, Box, Nav, TextInput } from 'grommet'
import { ReactNode, useState } from 'react'
import * as Icon from 'grommet-icons'
import useSWR from 'swr'
import { arweave } from '../utils/arweave'
import AnchorLink from './anchor-link'

export default function Layout(props: { children: ReactNode }) {
  const [keyword, setKeyword] = useState('')
  const { data } = useSWR(keyword ? ['search', keyword] : null, async () => {
    try {
      const [block, transaction, wallet] = await Promise.all([
        arweave.transactions.get(keyword).catch(() => null),
        arweave.blocks.get(keyword).catch(() => null),
        arweave.wallets.getBalance(keyword).catch(() => null),
      ])
      return { transaction, block, wallet }
    } catch {
      return undefined
    }
  })
  console.log(data)

  return (
    <>
      <Nav direction="row" background="dark-1" pad="small" justify="center">
        <Box
          width={{ max: '940px' }}
          pad={{ left: 'medium', right: 'medium' }}
          fill="horizontal"
          direction="row"
          align="center"
          gap="20px"
        >
          <Box width="min-content">
            <AnchorLink to="/" color="light-1">
              SCAR
            </AnchorLink>
          </Box>
          <Box fill="horizontal">
            <TextInput
              size="xsmall"
              icon={<Icon.Search />}
              plain={true}
              placeholder="block, transaction"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </Box>
          <Anchor href="https://github.com/renzholy/scar" target="_blank" style={{ lineHeight: 0 }}>
            <Icon.Github />
          </Anchor>
        </Box>
      </Nav>
      {props.children}
    </>
  )
}

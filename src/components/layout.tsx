import { Anchor, Box, Nav } from 'grommet'
import { ReactNode } from 'react'
import * as Icon from 'grommet-icons'
import AnchorLink from './anchor-link'

export default function Layout(props: { children: ReactNode }) {
  return (
    <>
      <Nav direction="row" background="dark-1" pad="small" justify="center">
        <Box
          width={{ max: '940px' }}
          pad={{ left: 'medium', right: 'medium' }}
          fill="horizontal"
          direction="row"
          justify="between"
        >
          <Box width="min-content">
            <AnchorLink to="/" color="light-1">
              SCAR
            </AnchorLink>
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

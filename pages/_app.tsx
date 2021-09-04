import { grommet, Grommet, Nav, Box, Anchor } from 'grommet'
import { AppProps } from 'next/app'
import { createGlobalStyle } from 'styled-components'
import Link from 'next/link'

const GlobalStyle = createGlobalStyle`
::-webkit-scrollbar {
  display: none;
}

body {
  margin: 0;
  background-color: black;
}
`

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Grommet theme={grommet} themeMode="dark">
      <GlobalStyle />
      <Nav direction="row" background="brand" pad="small" justify="center">
        <Box width={{ max: '940px' }} pad={{ left: 'medium', right: 'medium' }} fill>
          <Box width="min-content">
            <Link href="/" passHref={true}>
              <Anchor>SCAR</Anchor>
            </Link>
          </Box>
        </Box>
      </Nav>
      <Component {...pageProps} />
    </Grommet>
  )
}

export default MyApp

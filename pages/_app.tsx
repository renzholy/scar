import { grommet, Grommet, Nav, Box, Anchor } from 'grommet'
import { AppProps } from 'next/app'
import { createGlobalStyle } from 'styled-components'
import Link from 'next/link'
import Head from 'next/head'

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
    <>
      <Head>
        <meta charSet="UTF-8" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📡</text></svg>"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>SCAR</title>
      </Head>
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
    </>
  )
}

export default MyApp

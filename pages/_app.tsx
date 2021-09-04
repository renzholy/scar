import { Text, grommet, Grommet, Nav, Box } from 'grommet'
import { AppProps } from 'next/app'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
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
        <Box width={{ max: '940px' }} fill>
          <Text>SCAR</Text>
        </Box>
      </Nav>
      <Component {...pageProps} />
    </Grommet>
  )
}

export default MyApp

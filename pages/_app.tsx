import { grommet, Grommet, Nav } from 'grommet'
import * as Icons from 'grommet-icons'
import { AppProps } from 'next/app'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Grommet theme={grommet}>
      <GlobalStyle />
      <Nav direction="row" background="brand" pad="small">
        <Icons.Home />
        <Icons.Notification />
        <Icons.ChatOption />
      </Nav>
      <Component {...pageProps} />
    </Grommet>
  )
}

export default MyApp

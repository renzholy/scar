import { Anchor, grommet, Grommet, Nav } from 'grommet'
import * as Icons from 'grommet-icons'
import { AppProps } from 'next/app'
import { useRouter } from 'next/dist/client/router'
import { createGlobalStyle } from 'styled-components'
import Link from 'next/link'

const GlobalStyle = createGlobalStyle`
body {
  margin: 0;
  background-color: black;
}
`

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  return (
    <Grommet theme={grommet} themeMode="dark">
      <GlobalStyle />
      <Nav direction="row" background="brand" pad="small">
        <Link href="/" passHref={true}>
          <Anchor style={{ lineHeight: 0 }}>
            <Icons.Home color={router.asPath === '/' ? 'accent-1' : undefined} />
          </Anchor>
        </Link>
        <Link href="/blocks" passHref={true}>
          <Anchor style={{ lineHeight: 0 }}>
            <Icons.Cube color={router.asPath === '/blocks' ? 'accent-1' : undefined} />
          </Anchor>
        </Link>
        <Link href="/txs" passHref={true}>
          <Anchor style={{ lineHeight: 0 }}>
            <Icons.Transaction color={router.asPath === '/txs' ? 'accent-1' : undefined} />
          </Anchor>
        </Link>
        <Link href="/addresses" passHref={true}>
          <Anchor style={{ lineHeight: 0 }}>
            <Icons.Currency color={router.asPath === '/addresses' ? 'accent-1' : undefined} />
          </Anchor>
        </Link>
      </Nav>
      <Component {...pageProps} />
    </Grommet>
  )
}

export default MyApp

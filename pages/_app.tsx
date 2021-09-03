import { grommet, Grommet } from 'grommet'
import { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Grommet theme={grommet}>
      <Component {...pageProps} />
    </Grommet>
  )
}

export default MyApp

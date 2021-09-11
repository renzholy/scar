import { HashRouter, Switch, Route } from 'react-router-dom'
import { grommet, Grommet } from 'grommet'
import Layout from './components/layout'
import IndexPage from './pages/index'
import BlockPage from './pages/block'
import TransactionPage from './pages/tx'
import AddressPage from './pages/address'

export default function App() {
  return (
    <Grommet theme={grommet} themeMode="dark">
      <HashRouter>
        <Layout>
          <Switch>
            <Route path="/block/:hash">
              <BlockPage />
            </Route>
            <Route path="/tx/:hash">
              <TransactionPage />
            </Route>
            <Route path="/address/:hash">
              <AddressPage />
            </Route>
            <Route path="/" exact>
              <IndexPage />
            </Route>
          </Switch>
        </Layout>
      </HashRouter>
    </Grommet>
  )
}

import { HashRouter, Routes, Route } from 'react-router-dom'
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
          <Routes>
            <Route path="/block/:hash" element={<BlockPage />} />
            <Route path="/tx/:hash" element={<TransactionPage />} />
            <Route path="/address/:hash" element={<AddressPage />}></Route>
            <Route path="/" element={<IndexPage />} />
          </Routes>
        </Layout>
      </HashRouter>
    </Grommet>
  )
}

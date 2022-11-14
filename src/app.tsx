import { HashRouter, Routes, Route } from 'react-router-dom'
import { grommet, Grommet } from 'grommet'
const { default: Layout } = await import('./components/layout')
const { default: IndexPage } = await import('./pages/index')
const { default: BlockPage } = await import('./pages/block')
const { default: TransactionPage } = await import('./pages/tx')
const { default: AddressPage } = await import('./pages/address')

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

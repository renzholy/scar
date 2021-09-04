import uniqBy from 'lodash/uniqBy'
import useSWR from 'swr'
import { SWRConfiguration } from 'swr/dist/types'
import { arweave } from '../utils/arweave'

export default function usePeersLocation(config?: SWRConfiguration) {
  return useSWR<{ lat: number; lon: number }[]>(
    'usePeersLocation',
    async () => {
      const peers = await arweave.network.getPeers()
      const ips = peers.map((peer) => peer.split(':')[0])
      const response = await fetch('/api/geoip', {
        method: 'POST',
        body: JSON.stringify({ ips }),
        headers: { 'Content-Type': 'application/json' },
      })
      const json = (await response.json()) as { lat: number; lon: number }[]
      return uniqBy(
        json.filter(({ lat, lon }) => lat && lon),
        ({ lat, lon }) => `${lat}${lon}`,
      )
    },
    config,
  )
}
